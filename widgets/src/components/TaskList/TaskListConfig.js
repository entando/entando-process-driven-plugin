import React from 'react';
import { FormGroup, ControlLabel, Checkbox, HelpBlock, Row, Col } from 'patternfly-react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { withStyles } from '@material-ui/core/styles';

import { getConnections } from 'api/pda/connections';
import { getGroups } from 'api/pda/groups';
import { getColumns } from 'api/pda/tasks';
import { normalizeConfigColumns, normalizeConfigGroups } from 'components/TaskList/normalizeData';
import taskListConfigType from 'types/taskListConfigType';
import RenderSwitch from 'components/common/RenderSwitch';
import Notification from 'components/common/Notification';

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
    config: {
      knowledgeSource: '',
      options: generalOptions,
      groups: [],
      columns: [],
    },
    sourceList: [],
    errorAlert: null,
  };

  componentDidMount = async () => {
    try {
      // get list of connections
      const sourceList = await getConnections();
      if (sourceList.errors && sourceList.errors.length) {
        throw sourceList.errors[0];
      }

      // fetch screen if a default config prop is passed
      this.setState({ sourceList: sourceList.payload }, this.fetchScreen);
    } catch (error) {
      this.handleError(error.message);
    }
  };

  componentDidUpdate = async prevProps => {
    const { config } = this.props;

    // refetch state if config changes
    if (JSON.stringify(config) !== JSON.stringify(prevProps.config)) {
      this.fetchScreen();
    }
  };

  fetchScreen = () => {
    const { config } = this.props;
    if (config && config.knowledgeSource) {
      this.onChangeSource(config.knowledgeSource, () => {
        this.setState({
          config: {
            ...config,
            groups: JSON.parse(config.groups),
            options: JSON.parse(config.options),
            columns: JSON.parse(config.columns),
          },
        });
      });
    }
  };

  onChangeSource = (e, cb) => {
    const { config } = this.state;
    const knowledgeSource = e.target ? e.target.value : e;
    this.setState(
      {
        config: {
          ...config,
          options: [...generalOptions],
          groups: [],
          columns: [],
          knowledgeSource,
        },
      },
      async () => {
        if (cb) {
          cb();
        } else {
          try {
            const { payload: groups } = await getGroups(knowledgeSource);
            const { payload: columns } = await getColumns(knowledgeSource);

            this.setState(state => ({
              config: {
                ...state.config,
                groups: normalizeConfigGroups(groups),
                columns: normalizeConfigColumns(columns),
              },
            }));
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log('Error while trying to fetch groups and columns from PDA server', error);
          }
        }
      }
    );
  };

  handleSortStart = ({ node }) => {
    const tds = document.getElementsByClassName('table-sortableHelper')[0].childNodes;
    node.childNodes.forEach((n, idx) => {
      tds[idx].style.width = `${n.offsetWidth}px`;
    });
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ config }) => ({
      config: {
        ...config,
        columns: arrayMove(config.columns, oldIndex, newIndex).map((column, i) => ({
          ...column,
          position: i,
        })),
      },
    }));
  };

  handleColumnChange = index => e => {
    const { config } = this.state;
    const { value, checked, type } = e.target;
    const newColumns = [...config.columns];
    if (type === 'checkbox') {
      newColumns[index].isVisible = checked;
    } else {
      newColumns[index].header = value;
    }
    this.setState({ config: { ...config, columns: newColumns } });
  };

  handleOptions = index => e => {
    const { config } = this.state;
    const { value } = e.state;
    const newOptions = [...config.options];

    newOptions[index].checked = value;
    this.setState({ config: { ...config, options: newOptions } });
  };

  handleGroups = index => e => {
    const { config } = this.state;
    const { value } = e.state;
    const newGroups = [...config.groups];

    newGroups[index].checked = value;
    this.setState({ config: { ...config, groups: newGroups } });
  };

  closeNotification = () => {
    this.setState({ errorAlert: null });
  };

  handleError(err) {
    this.setState({
      errorAlert: err,
    });
  }

  render() {
    const { sourceList, config, errorAlert } = this.state;
    const { knowledgeSource, groups, columns, options } = config;
    return (
      <div>
        <Notification type="error" message={errorAlert} onClose={this.closeNotification} />
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
            </Col>
          </Row>
          {knowledgeSource && (
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
            </section>
          )}
        </form>
      </div>
    );
  }
}

TaskListConfig.propTypes = {
  config: taskListConfigType,
};

TaskListConfig.defaultProps = {
  config: {},
};

const TaskListConfigContainer = withStyles(styles)(TaskListConfig);

export default TaskListConfigContainer;
