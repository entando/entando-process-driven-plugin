import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import theme from 'theme';
import withAuth from 'components/common/authentication/withAuth';
import ErrorNotification from 'components/common/ErrorNotification';
import WidgetBox from 'components/common/WidgetBox';
import JSONForm from 'components/common/form/JSONForm';
import { getTask, getTaskForm, postTaskForm } from 'api/pda/tasks';
import { getPageWidget } from 'api/app-builder/pages';

class TaskCompletionFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      formSchema: null,
      formData: {},
      errorMessage: '',
    };

    this.fetchTaskFormData = this.fetchTaskFormData.bind(this);
    this.fetchSchema = this.fetchSchema.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const config = await this.fetchWidgetConfigs();

      this.setState({ config }, async () => {
        const formDataPromise = this.fetchTaskFormData();
        const formSchemaPromise = this.fetchSchema();

        const formData = await formDataPromise;
        const formSchema = await formSchemaPromise;

        this.setState({ formData, formSchema, loading: false });
      });
    });
  }

  async onSubmitForm({ formData }) {
    const { config } = this.state;
    const { taskId, onSubmitForm } = this.props;

    const connection = (config && config.knowledgeSource) || '';
    const containerId = (config && config.containerId) || '';
    const taskContainerId = `${taskId}@${containerId}`;

    try {
      await postTaskForm(connection, taskContainerId, formData);
    } catch (error) {
      this.handleError(error.message);
    }

    onSubmitForm(formData);
  }

  closeNotification = () => {
    this.setState({ errorMessage: '' });
  };

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId, 'COMPLETION_FORM');
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }
      const { config } = widgetConfigs.payload;
      const settings = (config.settings && JSON.parse(config.settings)) || {};

      const parsedSettings = Object.keys(settings).reduce(
        (acc, settingKey) => ({
          ...acc,
          [settingKey]: JSON.parse(settings[settingKey]),
        }),
        {}
      );

      return {
        ...config,
        settings: parsedSettings,
      };
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  async fetchTaskFormData() {
    const { config } = this.state;
    const { taskId } = this.props;

    const connection = (config && config.knowledgeSource) || '';
    const containerId = (config && config.containerId) || '';
    const taskContainerId = `${taskId}@${containerId}`;

    try {
      const task = await getTask(connection, taskContainerId);

      return (task && task.payload && task.payload.outputData) || {};
    } catch (error) {
      this.handleError(error.message);
    }
    return {};
  }

  async fetchSchema() {
    const { config } = this.state;
    const { taskId } = this.props;

    const connection = (config && config.knowledgeSource) || '';
    const containerId = (config && config.containerId) || '';
    const taskContainerId = `${taskId}@${containerId}`;

    try {
      const formSchema = await getTaskForm(connection, taskContainerId);
      return formSchema;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  handleError(errorMessage) {
    this.setState({ errorMessage });
    const { onError } = this.props;
    onError(errorMessage);
  }

  render() {
    const { loading, formData, formSchema, config, errorMessage } = this.state;

    const uiSchema = (config && config.settings && config.settings.uiSchema) || {};

    return (
      <ThemeProvider theme={theme}>
        <Container disableGutters>
          <WidgetBox>
            <JSONForm
              loading={loading}
              formSchema={formSchema}
              formData={formData}
              uiSchema={uiSchema}
              onSubmitForm={this.onSubmitForm}
            />
          </WidgetBox>
        </Container>
        <ErrorNotification message={errorMessage} onClose={this.closeNotification} />
      </ThemeProvider>
    );
  }
}

TaskCompletionFormContainer.propTypes = {
  taskId: PropTypes.string.isRequired,
  onError: PropTypes.func,
  onSubmitForm: PropTypes.func,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

TaskCompletionFormContainer.defaultProps = {
  onError: () => {},
  onSubmitForm: () => {},
  pageCode: '',
  frameId: '',
};

export default withAuth(TaskCompletionFormContainer, [
  'task-get',
  'task-form-get',
  'task-form-submit',
]);
