import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import theme from 'theme';
import withAuth from 'components/common/auth/withAuth';
import { getTask, getTaskForm, postTaskForm } from 'api/pda/tasks';
import { getPageWidget } from 'api/app-builder/pages';
import CustomEventContext from 'components/common/CustomEventContext';
import WidgetBox from 'components/common/WidgetBox';
import JSONForm from 'components/common/form/JSONForm';

class TaskCompletionFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      submitting: false,
      formSchema: null,
      formData: {},
    };

    this.fetchTaskFormData = this.fetchTaskFormData.bind(this);
    this.fetchSchema = this.fetchSchema.bind(this);
    this.submitProcessForm = this.submitProcessForm.bind(this);
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

    try {
      const task = await getTask(connection, taskId);

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

    try {
      const formSchema = await getTaskForm(connection, taskId);
      return formSchema;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  }

  submitProcessForm(form) {
    this.setState({ submitting: true }, async () => {
      const { config } = this.state;
      const { onSubmitForm } = this.props;

      const connection = (config && config.knowledgeSource) || '';
      const processContainerId = (config && config.process) || '';

      try {
        const response = await postTaskForm(connection, processContainerId, form.formData);
        onSubmitForm({ ...form, response });
      } catch (error) {
        this.handleError(error.message);
      } finally {
        this.setState({ submitting: false });
      }
    });
  }

  handleError(err) {
    const { onError } = this.props;
    onError(err);
  }

  render() {
    const { loading, submitting, formData, formSchema, config } = this.state;
    const { onError } = this.props;

    const uiSchema = (config && config.settings && config.settings.uiSchema) || {};
    const defaultColumnSize =
      (config && config.settings && config.settings.defaultColumnSize) || 12;

    return (
      <CustomEventContext.Provider value={{ onSubmitForm: this.submitProcessForm, onError }}>
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <WidgetBox>
              <JSONForm
                loading={loading}
                formSchema={formSchema}
                formData={formData}
                uiSchema={uiSchema}
                submitting={submitting}
                defaultColumnSize={defaultColumnSize}
              />
            </WidgetBox>
          </Container>
        </ThemeProvider>
      </CustomEventContext.Provider>
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
