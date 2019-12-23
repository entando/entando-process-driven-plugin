/* eslint-disable no-console */
import React from 'react';
import { FormGroup, ControlLabel, Checkbox, Button, HelpBlock, Row, Col } from 'patternfly-react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import withStyles from '@material-ui/core/styles/withStyles';

import { getConnections, getProcess, getGroups, getColumns } from 'api/taskList';
import { getPageWidget, putPageWidget } from 'api/app-builder/pages';
import { normalizeConfigColumns, normalizeConfigGroups } from 'components/TaskList/normalizeData';
import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import RenderSwitch from 'components/common/RenderSwitch';

const generalOptions = [
  {
    key: 'newPageOnClick',
    label: 'Open new page on table row click',
    checked: false,
  },
  {
    key: 'showClaim',
    label: 'Show Claim Button',
    checked: true,
  },
  {
    key: 'showComplete',
    label: 'Show Complete Button',
    checked: true,
  },
];

const SortableRow = SortableElement(({ value, onColumnChange }) => (
  <tr>
    <td>
      <i className="fa fa-bars" style={{ cursor: 'ns-resize' }} /> {value.position}
    </td>
    <td>{value.name}</td>
    <td>
      <Checkbox
        style={{ margin: 0 }}
        bsClass="checkbox"
        checked={value.isVisible}
        onChange={onColumnChange}
      />
    </td>
    <td>
      <input
        type="text"
        className="form-control"
        onChange={onColumnChange}
        value={value.header || ''}
      />
    </td>
  </tr>
));

const SortableBody = SortableContainer(({ items, onColumnChange }) => (
  <tbody>
    {items.map((value, index) => (
      <SortableRow
        key={value.name}
        index={index}
        value={value}
        onColumnChange={onColumnChange(index)}
      />
    ))}
  </tbody>
));

const styles = {
  paper: {
    padding: 20,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 15,
  },
  subtitle: {
    padding: '20px 0 20px 0',
  },
  formControl: {
    minWidth: 200,
  },
};

class TaskListConfig extends React.Component {
  state = {
    sourceList: [],
    processList: [],
    groups: [],
    columns: [],
    options: generalOptions,
    knowledgeSource: '',
    selectedProcess: '',
  };

  componentDidMount = async () => {
    const { framePos, pageCode } = this.props;
    // get list of connections
    const sourceList = await getConnections();
    this.setState({ sourceList: sourceList.payload });

    // get existing configs
    const pageWidgetsConfigs = await getPageWidget(pageCode, framePos);
    const configs = pageWidgetsConfigs.payload && pageWidgetsConfigs.payload.config;
    if (configs && configs.knowledgeSource) {
      this.onChangeSource(configs.knowledgeSource, () => {
        this.onChangeProcess(configs.process, () => {
          this.setState({
            groups: JSON.parse(configs.groups),
            options: JSON.parse(configs.options),
            columns: JSON.parse(configs.columns),
          });
        });
      });
    }
  };

  onChangeSource = (e, cb = () => {}) => {
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ knowledgeSource });

    getProcess(knowledgeSource).then(data => {
      this.setState({ processList: data.payload });
      cb();
    });
  };

  onChangeProcess = async (e, cb) => {
    const { knowledgeSource } = this.state;
    const selectedProcess = e.target ? e.target.value : e;
    this.setState({ selectedProcess });

    if (cb) {
      cb();
    } else {
      try {
        const { payload: groups } = await getGroups(knowledgeSource, selectedProcess);
        const { payload: columns } = await getColumns(knowledgeSource, selectedProcess);

        this.setState({
          groups: normalizeConfigGroups(groups),
          columns: normalizeConfigColumns(columns),
        });
      } catch (error) {
        console.log('Error while trying to fetch groups and columns from PDA server', error);
      }
    }
  };

  handleSortStart = ({ node }) => {
    const tds = document.getElementsByClassName('table-sortableHelper')[0].childNodes;
    node.childNodes.forEach((n, idx) => {
      tds[idx].style.width = `${n.offsetWidth}px`;
    });
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ columns }) => ({
      columns: arrayMove(columns, oldIndex, newIndex).map((column, i) => ({
        ...column,
        position: i,
      })),
    }));
  };

  handleColumnChange = index => e => {
    const { columns } = this.state;
    const { value, checked } = e.target;
    const newColumns = [...columns];
    if (e.target.type === 'checkbox') {
      newColumns[index].isVisible = checked;
    } else {
      newColumns[index].header = value;
    }
    this.setState({ columns: newColumns });
  };

  handleOptions = index => e => {
    const { options } = this.state;
    const { value } = e.state;
    const newOptions = [...options];

    newOptions[index].checked = value;
    this.setState({ options: newOptions });
  };

  handleGroups = index => e => {
    const { groups } = this.state;
    const { value } = e.state;
    const newGroups = [...groups];

    newGroups[index].checked = value;
    this.setState({ groups: newGroups });
  };

  handleSave = async () => {
    const { framePos, pageCode, widgetCode } = this.props;
    const { knowledgeSource, selectedProcess, options, groups, columns } = this.state;
    const body = {
      code: widgetCode,
    };

    body.config = {
      knowledgeSource,
      process: selectedProcess,
      options: JSON.stringify(options),
      groups: JSON.stringify(groups),
      columns: JSON.stringify(columns),
    };

    try {
      const response = await putPageWidget(pageCode, framePos, body);
      console.log('Configs got saved', response);
    } catch (error) {
      console.log('Error while saving configs', error);
    }
  };

  render() {
    const {
      knowledgeSource,
      sourceList,
      processList,
      selectedProcess,
      groups,
      columns,
      options,
    } = this.state;

    return (
      <div>
        <form>
          <Row>
            <Col xs={12}>
              <FormGroup controlId="connection">
                <ControlLabel>Knowledge Source</ControlLabel>
                <select
                  className="form-control"
                  value={knowledgeSource}
                  onChange={this.onChangeSource}
                >
                  <option value="">Select...</option>
                  {sourceList.map(source => (
                    <option key={source.name} value={source.name}>
                      {source.name}
                    </option>
                  ))}
                </select>
                <HelpBlock>Select one of the Kie server connections.</HelpBlock>
              </FormGroup>
              <FormGroup controlId="connection">
                <ControlLabel>Process</ControlLabel>
                <select
                  className="form-control"
                  value={selectedProcess}
                  onChange={this.onChangeProcess}
                >
                  <option value="">Select...</option>
                  {processList.map(process => (
                    <option
                      key={`${process['process-id']}@${process['container-id']}`}
                      value={`${process['process-id']}@${process['container-id']}`}
                    >
                      {`${process['process-name']} @ ${process['container-id']}`}
                    </option>
                  ))}
                </select>
                <HelpBlock>Select one BPM Process.</HelpBlock>
              </FormGroup>
            </Col>
          </Row>
          {selectedProcess && (
            <section>
              <legend>General options</legend>
              <Row>
                <Col xs={12}>
                  {options.map((item, i) => (
                    <RenderSwitch
                      key={item.key}
                      id={item.key}
                      label={item.label}
                      checked={item.checked}
                      onChange={this.handleOptions(i)}
                    />
                  ))}
                </Col>
              </Row>
              <legend>BPM Groups</legend>
              <Row>
                <Col xs={12}>
                  {groups.map((item, i) => (
                    <RenderSwitch
                      key={item.key}
                      id={item.key}
                      label={item.label}
                      checked={item.checked}
                      onChange={this.handleGroups(i)}
                    />
                  ))}
                </Col>
              </Row>
              <legend>Task Columns</legend>
              <Row>
                <Col xs={12}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Column Name</th>
                        <th>Visible</th>
                        <th>Override Fields</th>
                      </tr>
                    </thead>
                    <SortableBody
                      items={columns}
                      helperClass="table-sortableHelper"
                      onSortStart={this.handleSortStart}
                      onSortEnd={this.handleSortEnd}
                      onColumnChange={this.handleColumnChange}
                    />
                  </table>
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="text-right">
                  <Button bsClass="btn" bsStyle="primary" onClick={this.handleSave}>
                    Save
                  </Button>
                </Col>
              </Row>
            </section>
          )}
        </form>
      </div>
    );
  }
}

TaskListConfig.propTypes = {
  framePos: PropTypes.string.isRequired,
  widgetCode: PropTypes.string.isRequired,
  pageCode: PropTypes.string.isRequired,
};

TaskListConfig.defaultProps = {};

export default withStyles(styles)(TaskListConfig);
