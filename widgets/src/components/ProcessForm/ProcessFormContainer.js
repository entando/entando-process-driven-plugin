import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import Container from '@material-ui/core/Container';

import { getProcessForm, postProcessForm } from '../../api/pda/processes';
import { getPageWidget } from '../../api/app-builder/pages';
import theme from '../../theme';
import CustomEventContext from '../common/CustomEventContext';
import WidgetBox from '../common/WidgetBox';
import JSONForm from '../common/form/JSONForm';
import Notification from '../common/Notification';
import withAuth from '../common/auth/withAuth';

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

class ProcessFormContainer extends React.Component {
  state = {
    config: null,
    loading: false,
    submitting: false,
    formSchema: null,
    message: '',
    notificationType: '',
  };

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const config = await this.fetchWidgetConfigs();
      if (config) {
        this.setState({ config }, async () => {
          const formSchema = await this.fetchSchema();
          this.setState({ formSchema, loading: false });
        });
      }
    });
  }

  fetchWidgetConfigs = async () => {
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
          [settingKey]: isJsonString(settings[settingKey])
            ? JSON.parse(settings[settingKey])
            : settings[settingKey],
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
  };

  closeNotification = () => {
    this.setState({ message: '' });
  };

  fetchSchema = async () => {
    const { config } = this.state;
    const { knowledgeSource = '', settings = {} } = config;
    const { processDefinition } = settings;

    try {
      const formSchema = await getProcessForm(knowledgeSource, processDefinition);
      return formSchema;
    } catch (error) {
      this.handleError(error.message);
    }
    return null;
  };

  submitProcessForm = form => {
    this.setState({ submitting: true }, async () => {
      const { config } = this.state;
      const { onSubmitForm } = this.props;
      const { knowledgeSource = '', settings = {} } = config;
      const { processDefinition } = settings;

      try {
        const response = await postProcessForm(knowledgeSource, processDefinition, form.formData);
        onSubmitForm({ ...form, response });
        if (response.errors.length) {
          throw new Error(response.errors.join(', '));
        }
        this.setState({
          message: i18next.t('messages.success.formSubmitted'),
          notificationType: 'success',
        });
      } catch (error) {
        this.handleError(error.message);
      } finally {
        this.setState({ submitting: false });
      }
    });
  };

  handleError = message => {
    this.setState({ message, notificationType: 'error' });
    const { onError } = this.props;
    onError(message);
  };

  render() {
    const { loading, formSchema, config, submitting, message, notificationType } = this.state;
    const { onError } = this.props;

    const uiSchemas = (config && config.settings && config.settings.uiSchemas) || [];

    return (
      <CustomEventContext.Provider
        value={{
          onSubmitForm: this.submitProcessForm,
          onError,
        }}
      >
        <ThemeProvider theme={theme}>
          <Container disableGutters>
            <WidgetBox>
              <JSONForm
                loading={loading}
                formSchema={formSchema}
                uiSchemas={uiSchemas}
                submitting={submitting}
              />
            </WidgetBox>
          </Container>
          <Notification
            message={message}
            type={notificationType}
            onClose={this.closeNotification}
          />
        </ThemeProvider>
      </CustomEventContext.Provider>
    );
  }
}

ProcessFormContainer.propTypes = {
  onError: PropTypes.func,
  onSubmitForm: PropTypes.func,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

ProcessFormContainer.defaultProps = {
  onError: () => {},
  onSubmitForm: () => {},
  pageCode: '',
  frameId: '',
};

export default withAuth(ProcessFormContainer, [
  'process-definition-form-get',
  'process-definition-form-submit',
]);
