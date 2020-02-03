/* eslint-disable no-console */
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import { DOMAINS, LOCAL } from 'api/constants';
import { getAttachments, saveAttachment } from 'api/pda/attachments';
import { Typography } from '@material-ui/core';
import { getPageWidget } from 'api/app-builder/pages';
import SimpleDialog from 'components/common/SimpleDialog';
import theme from 'theme';
import AttachmentsSkeleton from './AttachmentsSkeleton';
import AddAttachmentModal from './AddAttachmentModal';
import Attachment from './Attachment';

const styles = {
  footer: {
    textAlign: 'right',
  },
};

class AttachmentsContainer extends React.Component {
  state = {
    attachments: [],
    loading: true,
    dialogOpen: false,
    connection: '',
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
        throw new Error('No configuration found for this widget');
      }

      const { config } = widgetConfigs.payload;
      return config;
    } catch (error) {
      this.handleError(error);
    }
    return null;
  };

  fetchAttachments = async () => {
    const { connection, process } = this.state;

    try {
      const attachments = await getAttachments(connection, process);
      if (attachments.errors.length) {
        throw attachments.errors[0];
      }

      return attachments.payload;
    } catch (error) {
      this.handleError(error);
    }
    return null;
  };

  toggleDialog = () => {
    this.setState(state => ({ dialogOpen: !state.dialogOpen }));
  };

  handleUpload = async files => {
    const { connection } = this.state;
    const { taskId } = this.props;
    console.log('begin upload of files:');
    try {
      const responses = [];
      await files.forEach(async file => {
        responses.push(await saveAttachment(connection, taskId, file));
      });
      console.log('Uploaded!');
    } catch (error) {
      this.handleError(error);
    }

    console.log('end upload of files:');
  };

  handleDelete = item => () => {
    console.log(item);
  };

  handleError = error => {
    console.log(error);
  };

  render() {
    const { attachments, loading, dialogOpen } = this.state;
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div>
          <Typography variant="h3">Attachments</Typography>
          {loading ? (
            <AttachmentsSkeleton rows={3} />
          ) : (
            <List>
              {attachments.map(item => (
                <Attachment key={item.id} item={item} onDelete={this.handleDelete} />
              ))}
            </List>
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
      </ThemeProvider>
    );
  }
}

AttachmentsContainer.propTypes = {
  classes: PropTypes.shape({
    listItem: PropTypes.string,
    truncate: PropTypes.string,
    footer: PropTypes.string,
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
