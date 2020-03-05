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

const createLink = (pageCode = 'pda_task_details', taskId, locale = 'en') =>
  `/entando-de-app/${locale}/${pageCode}.page?taskId=${taskId}`;

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
    const { config, loadingTask } = this.state;
    const { taskId } = this.props;

    const connection = (config && config.knowledgeSource) || '';

    if (!loadingTask) {
      this.setState({ loadingTask: true });
    }

    try {
      const task = await getTask(connection, taskId);

      this.setState({
        task: (task && task.payload) || null,
        taskInputData: (task && task.payload && task.payload.inputData) || {},
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
    const { loadingTask, task, taskInputData, config } = this.state;
    const { onPressPrevious, onPressNext, onError, taskId } = this.props;
    const configs = config && config.settings;
    console.log(configs);

    return (
      <CustomEventContext.Provider value={{ onPressPrevious, onPressNext, onError }}>
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <Box mb="20px">
              <Overview
                task={task}
                loadingTask={loadingTask}
                headerLabel={configs && configs.header}
                taskLink={createLink(configs && configs.destinationPageCode, taskId)}
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
