import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { ThemeProvider } from '@material-ui/core/styles';
import { Container, Box } from '@material-ui/core';

import { getTask, fetchSingleTask } from 'api/pda/tasks';
import { getPageWidget } from 'api/app-builder/pages';
import { DOMAINS } from 'api/constants';
import theme from 'theme';
import CustomEventContext from 'components/TaskDetails/CustomEventContext';
import Overview from 'components/TaskDetails/Overview';
import GeneralInformation from 'components/TaskDetails/GeneralInformation';
import withAuth from 'components/common/auth/withAuth';

const createLink = (pageCode = 'pda_task_details', taskId, taskPos, groups = '', locale = 'en') =>
  `${DOMAINS.APP_BUILDER}/${locale}/${pageCode}.page?taskId=${taskId}&taskPos=${taskPos}&groups=${groups}`;

class TaskDetailsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loadingTask: false,
      task: null,
      taskPos: 0,
      isLast: false,
    };

    this.fetchWidgetConfigs = this.fetchWidgetConfigs.bind(this);
    this.handlePressPrevious = this.handlePressPrevious.bind(this);
    this.handlePressNext = this.handlePressNext.bind(this);
    this.fetchTaskListEntry = this.fetchTaskListEntry.bind(this);
    this.fetchTask = this.fetchTask.bind(this);
  }

  componentDidMount() {
    this.setState({ loadingTask: true }, async () => {
      const config = await this.fetchWidgetConfigs();
      this.setState({ config }, this.fetchTask);
    });
  }

  componentDidUpdate = prevProps => {
    const { taskId } = this.props;

    // when taskId attribute is changed, new task should be fetched
    if (prevProps.taskId !== taskId) {
      this.fetchTask();
    }
  };

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId, 'TASK_DETAILS');
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }

      return widgetConfigs.payload.config;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  async fetchTaskListEntry(taskPosition) {
    const { config } = this.state;

    const connection = config && config.knowledgeSource;

    if (!connection) {
      this.handleError(i18next.t('messages.errors.noConnection'));
    } else {
      this.setState({ loadingTask: true });

      const { task, metadata } = await fetchSingleTask({
        connection,
        taskPosition,
        onError: this.handleError,
      });
      return { ...task, pos: taskPosition, lastPage: metadata.lastPage };
    }
    return {};
  }

  async fetchTask() {
    const { config } = this.state;
    const { taskPos, taskId, lastPage } = this.props;

    const connection = config && config.knowledgeSource;
    if (!connection) {
      this.handleError(i18next.t('messages.errors.noConnection'));
    } else if (taskId) {
      this.setState({ loadingTask: true }, async () => {
        try {
          const { payload: task } = await getTask(connection, taskId);

          this.setState({
            task: task || null,
            taskPos,
            isLast: lastPage === 1,
          });
        } catch (error) {
          this.handleError(error.message);
        } finally {
          this.setState({ loadingTask: false });
        }
      });
    }
  }

  async handlePressPrevious() {
    const { onSelectTask, taskPos } = this.props;

    if (taskPos > 0) {
      const task = await this.fetchTaskListEntry(taskPos - 1);
      onSelectTask(task);
    }
  }

  async handlePressNext() {
    const { isLast } = this.state;
    const { onSelectTask, taskPos } = this.props;

    if (!isLast) {
      const task = await this.fetchTaskListEntry(taskPos + 1);
      onSelectTask(task);
    }
  }

  handleError(err) {
    const { onError } = this.props;
    onError(err);
  }

  render() {
    const { loadingTask, task, taskPos, isLast, config, groups } = this.state;
    const { onError, taskId } = this.props;
    const isFirst = taskPos === 0;
    const configSettings = config && config.settings;
    const configs =
      typeof configSettings === 'string' ? JSON.parse(config.settings) : configSettings;

    const hasGeneralInformation = (taskId && configs && configs.hasGeneralInformation) || false;
    const taskInputData = (task && task.inputData) || {};

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
          <Container maxWidth={false} disableGutters>
            <Box mb={hasGeneralInformation ? '20px' : '0px'}>
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
            {hasGeneralInformation && (
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
  taskPos: PropTypes.number.isRequired,
  lastPage: PropTypes.number.isRequired,
  onError: PropTypes.func,
  onSelectTask: PropTypes.func,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

TaskDetailsContainer.defaultProps = {
  onError: () => {},
  onSelectTask: () => {},
  pageCode: '',
  frameId: '',
};

export default withAuth(TaskDetailsContainer, ['task-get']);
