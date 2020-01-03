import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';

import { SERVICE } from 'api/constants';
import { getTask } from 'api/taskDetails';
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
      loadingTask: false,
      task: null,
      connection: null,
    };

    this.fetchTask = this.fetchTask.bind(this);
    this.fetchWidgetConfigs = this.fetchWidgetConfigs.bind(this);
    this.handleSkeletonChange = this.handleSkeletonChange.bind(this);
  }

  componentDidMount() {
    const { serviceUrl } = this.props;
    SERVICE.URL = serviceUrl;

    this.setState({ loadingTask: true }, this.fetchTask);
  }

  componentDidUpdate = prevProps => {
    const { taskId } = this.props;
    if (prevProps.taskId !== taskId) {
      this.fetchTask();
    }
  };

  async fetchTask() {
    const { connection: storedConnection } = this.state;
    const { taskId } = this.props;
    try {
      const connection = storedConnection || (await this.fetchWidgetConfigs());

      const task = await getTask(connection, taskId);

      const taskInputData = Object.keys(task)
        .filter(key => key.startsWith('task-input-data.'))
        .reduce((acc, key) => ({ ...acc, [key]: task[key] }), {});

      this.setState({
        loadingTask: false,
        task,
        taskInputData,
        connection,
      });
    } catch (error) {
      this.handleError(error.message);
    }
  }

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId);
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }
      const { config } = widgetConfigs.payload;
      return config.knowledgeSource;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  handleSkeletonChange() {
    const { loadingTask } = this.state;
    this.setState({ loadingTask: !loadingTask });
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
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

TaskDetailsContainer.defaultProps = {
  onError: () => {},
  onPressPrevious: () => {},
  onPressNext: () => {},
  serviceUrl: '',
  pageCode: '',
  frameId: '',
};

export default withStyles(styles)(TaskDetailsContainer);
