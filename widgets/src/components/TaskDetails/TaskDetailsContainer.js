import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { Container, Box } from '@material-ui/core';

import { getTask } from 'api/pda/tasks';
import { getPageWidget } from 'api/app-builder/pages';
import theme from 'theme';
import CustomEventContext from 'components/TaskDetails/CustomEventContext';
import Overview from 'components/TaskDetails/Overview';
import GeneralInformation from 'components/TaskDetails/GeneralInformation';

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

  async fetchTask() {
    const { config } = this.state;
    const { taskId } = this.props;

    const connection = (config && config.knowledgeSource) || '';
    const [, containerId] = (config && config.process && config.process.split('@')) || '';
    const taskContainerId = `${taskId}@${containerId}`;

    try {
      const task = await getTask(connection, taskContainerId);

      this.setState({
        loadingTask: false,
        task: (task && task.payload) || null,
        taskInputData: (task && task.payload && task.payload.inputData) || {},
      });
    } catch (error) {
      this.handleError(error.message);
    }
  }

  handleError(err) {
    const { onError } = this.props;
    onError(err);
  }

  render() {
    const { loadingTask, task, taskInputData } = this.state;
    const { onPressPrevious, onPressNext, onError } = this.props;

    return (
      <CustomEventContext.Provider value={{ onPressPrevious, onPressNext, onError }}>
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <Box mb="20px">
              <Overview task={task} loadingTask={loadingTask} />
            </Box>
            <GeneralInformation taskInputData={taskInputData} loadingTask={loadingTask} />
          </Container>
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

TaskDetailsContainer.propTypes = {
  taskId: PropTypes.string.isRequired,
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
