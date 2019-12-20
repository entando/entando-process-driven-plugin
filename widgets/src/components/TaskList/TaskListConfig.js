import React from 'react';
import { FormGroup, ControlLabel, Checkbox, Button, HelpBlock, Row, Col } from 'patternfly-react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import withStyles from '@material-ui/core/styles/withStyles';

import { getConnections, getProcess, getGroups, getColumns } from 'api/taskList';
import { getPageWidget, putPageWidget } from 'api/app-builder/pages';
import { normalizeConfigColumns, normalizeConfigGroups } from 'components/TaskList/normalizeData';
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

  componentDidMount = () => {
    const { framePos, pageCode } = this.props;
    // get existing configs
    getPageWidget(pageCode, framePos).then(data => {
      const configs = data.payload && data.payload.config;
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
    });

    getConnections().then(data => {
      this.setState({ sourceList: data.payload });
    });
  };

  onChangeSource = (e, cb = () => {}) => {
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState({ knowledgeSource });

    getProcess(knowledgeSource).then(data => {
      this.setState({ processList: data.payload });
      cb();
    });
  };

  onChangeProcess = (e, cb) => {
    const { knowledgeSource } = this.state;
    const selectedProcess = e.target ? e.target.value : e;
    this.setState({ selectedProcess });

    if (cb) {
      cb();
    } else {
      Promise.all([
        getGroups(knowledgeSource, selectedProcess),
        getColumns(knowledgeSource, selectedProcess),
      ])
        .then(async responses => {
          if (responses[0].ok && responses[1].ok) {
            return [await responses[0].json(), await responses[1].json()];
          }
          return null;
        })
        .then(([r1, r2]) => {
          this.setState({
            groups: normalizeConfigGroups(r1.payload),
            columns: normalizeConfigColumns(r2.payload),
          });
        });
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
    const { value, options } = e.state;
    const newOptions = [...options];

    newOptions[index].checked = value;
    this.setState({ options: newOptions });
  };

  handleGroups = index => e => {
    const { value, groups } = e.state;
    const newGroups = [...groups];

    newGroups[index].checked = value;
    this.setState({ groups: newGroups });
  };

  handleSave = () => {
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

    putPageWidget(pageCode, framePos, body).then(response =>
      response.json().then(() => {
        if (response.ok) {
          // history.push(routeConverter(ROUTE_PAGE_CONFIG, { pageCode }));
        }
      })
    );
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
  framePos: PropTypes.number.isRequired,
  widgetCode: PropTypes.string.isRequired,
  pageCode: PropTypes.string.isRequired,
};

TaskListConfig.defaultProps = {};

export default withStyles(styles)(TaskListConfig);
