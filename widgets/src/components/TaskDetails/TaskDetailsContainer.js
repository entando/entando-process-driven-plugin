import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';

import { getTask } from 'api/pda/tasks';
import { getPageWidget } from 'api/app-builder/pages';
import theme from 'theme';
import CustomEventContext from 'components/TaskDetails/CustomEventContext';
import WidgetBox from 'components/common/WidgetBox';
import Overview from 'components/TaskDetails/Overview';
import GeneralInformation from 'components/TaskDetails/GeneralInformation';

const styles = {
  taskDetailWidgetBox: {
    marginBottom: '20px',
  },
};

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
    const [, containerId] = (config && config.process && config.process.split('@')) || '';
    const taskContainerId = `${taskId}@${containerId}`;

    if (!loadingTask) this.setState({ loadingTask: true });

    try {
      const task = await getTask(connection, taskContainerId);

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
    const { loadingTask, task, taskInputData } = this.state;
    const { classes, onPressPrevious, onPressNext, onError } = this.props;

    return (
      <CustomEventContext.Provider value={{ onPressPrevious, onPressNext, onError }}>
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <WidgetBox passedClassName={classes.taskDetailWidgetBox} mb={10}>
              <Overview task={task} loadingTask={loadingTask} />
            </WidgetBox>
            <WidgetBox>
              <GeneralInformation taskInputData={taskInputData} loadingTask={loadingTask} />
            </WidgetBox>
          </Container>
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

TaskDetailsContainer.propTypes = {
  classes: PropTypes.shape({
    taskDetailWidgetBox: PropTypes.string,
  }).isRequired,
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

export default withStyles(styles)(TaskDetailsContainer);
