import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import theme from 'theme';
import CustomEventContext from 'components/TaskDetails/CustomEventContext';
import WidgetBox from 'components/common/WidgetBox';
import CompletionForm from 'components/TaskCompletionForm/CompletionForm';
import { getTask, getTaskForm } from 'api/app-builder/taskDetails';
import { getPageWidget } from 'api/app-builder/pages';

class TaskCompletionFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: null,
      loading: false,
      formSchema: null,
      formData: {},
    };

    this.fetchTaskFormData = this.fetchTaskFormData.bind(this);
    this.fetchSchema = this.fetchSchema.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const config = await this.fetchWidgetConfigs();

      this.setState({ config }, () => {
        Promise.all([this.fetchTaskFormData(), this.fetchSchema()]).then(responses => {
          const [formData, formSchema] = responses;
          this.setState({ formData, formSchema, loading: false });
        });
      });
    });
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

  handleError(err) {
    const { onError } = this.props;
    onError(err);
  }

  render() {
    const { loading, formData, formSchema, config } = this.state;
    const { onSubmitForm, onError } = this.props;

    const uiSchema = (config && config.settings && config.settings.uiSchema) || {};

    return (
      <CustomEventContext.Provider value={{ onSubmitForm, onError }}>
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <WidgetBox>
              <CompletionForm
                loading={loading}
                formSchema={formSchema}
                formData={formData}
                uiSchema={uiSchema}
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

export default TaskCompletionFormContainer;
