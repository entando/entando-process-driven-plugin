/* eslint-disable no-console */
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import { DOMAINS, LOCAL } from 'api/constants';
import {
  getAttachments,
  saveAttachment,
  deleteAttachment,
  downloadAttachments,
} from 'api/pda/attachments';
import { Typography } from '@material-ui/core';
import { getPageWidget } from 'api/app-builder/pages';
import SimpleDialog from 'components/common/SimpleDialog';
import Notification from 'components/common/Notification';
import theme from 'theme';
import AttachmentsSkeleton from './AttachmentsSkeleton';
import AddAttachmentModal from './AddAttachmentModal';
import Attachment from './Attachment';

const styles = {
  footer: {
    textAlign: 'right',
  },
  empty: {
    border: 'solid 1px #eee',
    marginTop: 8,
    marginBottom: 2,
    background: 'white',
    borderRadius: 3,
    padding: 18,
    textAlign: 'center',
    height: 52,
  },
};

class AttachmentsContainer extends React.Component {
  state = {
    attachments: [],
    loading: true,
    dialogOpen: false,
    connection: '',
    notification: {},
  };

  componentDidMount = async () => {
    const { serviceUrl } = this.props;

    if (!LOCAL) {
      // set the PDA domain to the URL passed via props
      DOMAINS.PDA = serviceUrl;
    }

    const config = await this.fetchConfigs();
    this.setState({ connection: config.knowledgeSource }, async () => {
      const attachments = await this.fetchAttachments();
      this.setState({ attachments, loading: false });
    });
  };

  fetchConfigs = async () => {
    const { pageCode, frameId } = this.props;

    try {
      const widgetConfigs = await getPageWidget(pageCode, frameId, 'ATTACHMENTS');
      if (widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }
      if (!widgetConfigs.payload) {
        throw new Error(i18next.t('messages.errors.widgetConfig'));
      }

      const { config } = widgetConfigs.payload;
      return config;
    } catch (error) {
      this.handleError(error);
    }
    return {};
  };

  fetchAttachments = async () => {
    const { connection } = this.state;
    const { taskId } = this.props;

    let payload = [];

    try {
      const attachments = await getAttachments(connection, taskId);
      if (attachments.errors.length) {
        throw attachments.errors[0];
      }

      payload = attachments.payload;
    } catch (error) {
      if (!error.message.includes('404')) {
        this.handleError(error);
      }
    }
    return payload;
  };

  toggleDialog = () => {
    this.setState(state => ({ dialogOpen: !state.dialogOpen }));
  };

  handleUpload = async files => {
    const { connection } = this.state;
    const { taskId } = this.props;

    this.setState({ loading: true }, this.toggleDialog);
    try {
      const promises = files.map(async file => {
        await saveAttachment(connection, taskId, file);
      });

      const responses = await Promise.all(promises);
      if (responses.length) {
        const attachments = await this.fetchAttachments();
        this.setState({ attachments });
      }
    } catch (error) {
      this.handleError(error);
    }

    this.setState({ loading: false });
  };

  handleDelete = item => async () => {
    const { connection } = this.state;
    const { taskId } = this.props;
    try {
      this.setState({ loading: true });
      await deleteAttachment(connection, taskId, item.id);
      const attachments = await this.fetchAttachments();
      this.setState({ attachments });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleError = error => {
    this.setState({
      notification: { message: typeof error === 'object' ? error.message : error, type: 'error' },
    });
  };

  handleCloseNotifications = () => {
    this.setState({ notification: {} });
  };

  handleDownload = item => async e => {
    const { connection } = this.state;
    const { taskId } = this.props;

    e.preventDefault();

    try {
      this.setState({ loading: true });
      const response = await downloadAttachments(connection, taskId, item.id);

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.blob()]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', item.name);

      // download
      document.body.appendChild(link);
      link.click();
      // clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { attachments, loading, dialogOpen, notification } = this.state;
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div>
          <Typography variant="h3">Attachments</Typography>
          {loading ? (
            <AttachmentsSkeleton rows={3} />
          ) : attachments.length ? (
            <List>
              {attachments.map(item => (
                <Attachment
                  key={item.id}
                  item={item}
                  onDelete={this.handleDelete}
                  onDownload={this.handleDownload}
                />
              ))}
            </List>
          ) : (
            <div className={classes.empty}>
              <Typography>{`${i18next.t('messages.warnings.noAttachments')}.`}</Typography>
            </div>
          )}
          <div className={classes.footer}>
            <Button variant="outlined" color="primary" onClick={this.toggleDialog}>
              Add
            </Button>
          </div>
        </div>
        <SimpleDialog
          title="Add new Attachment"
          open={dialogOpen}
          body={<AddAttachmentModal onUpload={this.handleUpload} onClose={this.toggleDialog} />}
          onClose={this.toggleDialog}
          maxWidth="md"
        />
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={this.handleCloseNotifications}
        />
      </ThemeProvider>
    );
  }
}

AttachmentsContainer.propTypes = {
  classes: PropTypes.shape({
    footer: PropTypes.string,
    empty: PropTypes.string,
  }),
  taskId: PropTypes.string.isRequired,
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

AttachmentsContainer.defaultProps = {
  classes: {},
  serviceUrl: '',
  pageCode: '',
  frameId: '',
};

export default withStyles(styles)(AttachmentsContainer);
