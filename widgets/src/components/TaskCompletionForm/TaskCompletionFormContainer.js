import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import theme from 'theme';
import withAuth from 'components/common/auth/withAuth';
import { getTask, getTaskForm, postTaskForm } from 'api/pda/tasks';
import { getPageWidget } from 'api/app-builder/pages';
import CustomEventContext from 'components/common/CustomEventContext';
import WidgetBox from 'components/common/WidgetBox';
import JSONForm from 'components/common/form/JSONForm';
import utils from '../../utils';

class TaskCompletionFormContainer extends React.Component {
  static extractProperties(node, nodeName = '', path = '') {
    // if node.type is object - it has own properties
    if (!node) {
      return [];
    }

    if (node.type === 'object') {
      const nodesProperties = Object.keys(node.properties);
      const paths = nodesProperties.map(property =>
        TaskCompletionFormContainer.extractProperties(
          node.properties[property],
          property,
          path ? `${path}.${nodeName}` : nodeName
        )
      );
      return paths.flat();
    }

    // if node.type is not an object - it a final property
    return path ? `${path}.${nodeName}` : nodeName;
  }

  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      submitting: false,
      formSchema: null,
      formData: {},
    };

    this.fetchForm = this.fetchForm.bind(this);
    this.fetchTaskFormData = this.fetchTaskFormData.bind(this);
    this.fetchSchema = this.fetchSchema.bind(this);
    this.submitProcessForm = this.submitProcessForm.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const config = await this.fetchWidgetConfigs();
      this.setState({ config }, this.fetchForm);
    });
  }

  componentDidUpdate = prevProps => {
    const { taskId } = this.props;
    if (prevProps.taskId !== taskId) {
      this.fetchForm();
    }
  };

  async fetchWidgetConfigs() {
    const { pageCode, frameId } = this.props;
    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId);
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

  async fetchForm() {
    this.setState({ loading: true });
    const formDataPromise = this.fetchTaskFormData();
    const formSchemaPromise = this.fetchSchema();

    const taskData = await formDataPromise;
    const formSchema = await formSchemaPromise;

    const properties = TaskCompletionFormContainer.extractProperties(formSchema);

    const mergedData = { ...taskData.inputData, ...taskData.outputData };

    const formData = Object.keys(mergedData).reduce((acc, property) => {
      if (properties.includes(property)) {
        return { ...acc, [property]: mergedData[property] };
      }
      return acc;
    }, {});

    // TEMP PAM BUG FIX, REMOVE THIS WHEN FIXED ON PAM, PASS formData to this.setState
    const modifiedFormData = Object.keys(formData).reduce((acc, field) => {
      const path = field.split('.');

      let property = formSchema;
      for (let i = 0; i < path.length; i += 1) {
        property = property.properties[path[i]];
      }

      if (property.type === 'array') {
        if (!Array.isArray(formData[field])) {
          return { ...acc, [field]: [formData[field]] };
        }
      }

      return { ...acc, [field]: formData[field] };
    }, {});
    // ^^^ TEMP PAM BUG FIX, REMOVE THIS WHEN FIXED ON PAM, PASS formData TO this.setState()

    this.setState({ formData: utils.unflat(modifiedFormData), formSchema, loading: false });
  }

  async fetchTaskFormData() {
    const { config } = this.state;
    const { taskId } = this.props;

    const connection = config && config.knowledgeSource;

    if (!connection) {
      this.handleError(i18next.t('messages.errors.noConnection'));
    } else {
      try {
        const task = await getTask(connection, taskId);

        return (
          (task &&
            task.payload && {
              outputData: task.payload.outputData,
              inputData: task.payload.inputData,
            }) || { outputData: {}, inputData: {} }
        );
      } catch (error) {
        this.handleError(error.message);
      }
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
      const { taskId, onSubmitForm } = this.props;
      const connection = (config && config.knowledgeSource) || '';

      try {
        const response = await postTaskForm(connection, taskId, form.formData);
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

    const uiSchemas = (config && config.settings && config.settings.uiSchemas) || [];
    const defaultColumnSize =
      (config && config.settings && config.settings.defaultColumnSize) || 12;

    return (
      <CustomEventContext.Provider value={{ onSubmitForm: this.submitProcessForm, onError }}>
        <ThemeProvider theme={theme}>
          <Container maxWidth={false} disableGutters>
            <WidgetBox>
              <JSONForm
                loading={loading}
                formSchema={formSchema}
                formData={formData}
                uiSchemas={uiSchemas}
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
