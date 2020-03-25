import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { Container, Box } from '@material-ui/core';

import { getTasks, getTask } from 'api/pda/tasks';
import { getPageWidget } from 'api/app-builder/pages';
import theme from 'theme';
import CustomEventContext from 'components/TaskDetails/CustomEventContext';
import Overview from 'components/TaskDetails/Overview';
import GeneralInformation from 'components/TaskDetails/GeneralInformation';

const createLink = (pageCode = 'pda_task_details', taskId, taskPos, groups, locale = 'en') =>
  `/entando-de-app/${locale}/${pageCode}.page?taskId=${taskId}&taskPos=${taskPos}&groups=${groups}`;

class TaskDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loadingTask: false,
      task: null,
    };

    this.fetchTask = this.fetchTask.bind(this);
    this.fetchWidgetConfigs = this.fetchWidgetConfigs.bind(this);
  }

  componentDidMount() {
    this.setState({ loadingTask: true }, async () => {
      const { config: storedConfig } = this.state;
      const config = storedConfig || (await this.fetchWidgetConfigs());

      this.setState({ config }, () => this.fetchTask());
    });
  }

  componentDidUpdate = prevProps => {
    const { taskId } = this.props;
    if (prevProps.taskId !== taskId) {
      this.fetchTask();
    }
  };

  handlePressPrevious = () => {
    const { onPressPrevious } = this.props;
    const { taskPos } = this.state;
    this.fetchTask(+taskPos - 1);
    onPressPrevious();
  };

  handlePressNext = () => {
    const { onPressNext } = this.props;
    const { taskPos } = this.state;
    this.fetchTask(+taskPos + 1);
    onPressNext();
  };

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId, 'TASK_DETAILS');
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }

      const { config } = widgetConfigs.payload;

      return config;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  async fetchTask(pos) {
    const { config, loadingTask } = this.state;
    const { taskPos: propTaskPos, groups: propGroups } = this.props;

    let groups = propGroups;

    if (groups && groups[0] === '[') {
      groups = JSON.parse(groups);
      if (groups[0] instanceof Object) {
        groups = groups.filter(group => group.checked).map(group => group.key);
      }
    }

    const connection = (config && config.knowledgeSource) || '';

    const taskPos = +(pos === undefined ? propTaskPos : pos);

    if (!loadingTask) {
      this.setState({ loadingTask: true });
    }

    try {
      const {
        payload: tasks,
        metadata: { lastPage },
      } = await getTasks({ connection, groups }, taskPos, 1);

      if (!tasks) {
        throw new Error('messages.errors.errorResponse');
      }

      const { payload: task } = await getTask(connection, tasks[0].id);

      this.setState({
        task: task || null,
        taskInputData: (task && task.inputData) || {},
        taskPos,
        isLast: lastPage === 1,
        groups,
      });
    } catch (error) {
      this.handleError(error.message);
    } finally {
      this.setState({ loadingTask: false });
    }
  }

  handleError(err) {
    const { onError } = this.props;
    onError(err);
  }

  render() {
    const { loadingTask, task, taskInputData, taskPos, isLast, config, groups } = this.state;
    const { onError } = this.props;
    const isFirst = taskPos === 0;
    const configs = config && config.settings;

    return (
      <CustomEventContext.Provider
        value={{
          onPressPrevious: this.handlePressPrevious,
          onPressNext: this.handlePressNext,
          onError,
          isFirst,
          isLast,
        }}
      >
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <Box mb="20px">
              <Overview
                task={task}
                loadingTask={loadingTask}
                headerLabel={configs && configs.header}
                taskLink={createLink(
                  configs && configs.destinationPageCode,
                  task && task.id,
                  taskPos,
                  groups
                )}
              />
            </Box>
            {configs && configs.hasGeneralInformation && (
              <GeneralInformation taskInputData={taskInputData} loadingTask={loadingTask} />
            )}
          </Container>
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

TaskDetailsContainer.propTypes = {
  taskId: PropTypes.string.isRequired,
  taskPos: PropTypes.string.isRequired,
  groups: PropTypes.string.isRequired,
  onError: PropTypes.func,
  onPressPrevious: PropTypes.func,
  onPressNext: PropTypes.func,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

TaskDetailsContainer.defaultProps = {
  onError: () => {},
  onPressPrevious: () => {},
  onPressNext: () => {},
  pageCode: '',
  frameId: '',
};

export default TaskDetailsContainer;
