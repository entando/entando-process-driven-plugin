/* eslint-disable no-console */
import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

import { DOMAINS, LOCAL } from 'api/constants';
import { getAttachments, saveAttachment } from 'api/pda/attachments';
import { Typography } from '@material-ui/core';
import { getPageWidget } from 'api/app-builder/pages';
import SimpleDialog from 'components/common/SimpleDialog';
import theme from 'theme';
import AttachmentsSkeleton from './AttachmentsSkeleton';
import AddAttachmentModal from './AddAttachmentModal';

const styles = {
  listItem: {
    border: 'solid 1px #eee',
    marginBottom: 2,
    background: 'white',
    borderRadius: 3,
  },
  truncate: {
    display: 'block',
    overflow: 'hidden',
    width: '80%',
    textOverflow: 'ellipsis',
  },
  footer: {
    textAlign: 'right',
  },
};

class Attachments extends React.Component {
  state = {
    attachments: [],
    loading: true,
    dialogOpen: false,
    connection: '',
    process: '',
  };

  componentDidMount = async () => {
    const { serviceUrl } = this.props;

    if (!LOCAL) {
      // set the PDA domain to the URL passed via props
      DOMAINS.PDA = serviceUrl;
    }

    try {
      await this.fetchConfigs();
      await this.fetchAttachments();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchConfigs = async () => {
    const { pageCode, frameId } = this.props;

    const widgetConfigs = await getPageWidget(pageCode, frameId, 'ATTACHMENTS');
    if (widgetConfigs.errors.length) {
      throw widgetConfigs.errors[0];
    }
    if (!widgetConfigs.payload) {
      throw new Error('No configuration found for this widget');
    }

    const { config } = widgetConfigs.payload;
    await this.setState({ connection: config.knowledgeSource, process: config.process });
  };

  fetchAttachments = async () => {
    const { connection, process } = this.state;
    const attachments = await getAttachments(connection, process);
    if (attachments.errors.length) {
      throw attachments.errors[0];
    }
    await this.setState({ attachments: attachments.payload });
  };

  toggleDialog = () => {
    this.setState(state => ({ dialogOpen: !state.dialogOpen }));
  };

  handleUpload = async files => {
    console.log('begin upload of files:');
    try {
      const responses = [];
      await files.forEach(async file => {
        responses.push(await saveAttachment(file));
      });
      console.log('Uploaded!');
    } catch (error) {
      console.log(error);
    }

    console.log('end of upload of files:');
  };

  render() {
    const { attachments, loading, dialogOpen } = this.state;
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div>
          <Typography variant="h3">Attachments</Typography>
          {loading ? (
            <AttachmentsSkeleton rows={5} />
          ) : (
            <List>
              {attachments.map(item => (
                <ListItem key={item.id} className={classes.listItem}>
                  <ListItemIcon>
                    <FileCopyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText className={classes.truncate}>{item.name}</ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
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
          body={<AddAttachmentModal onUpload={this.handleUpload} />}
          onClose={this.toggleDialog}
          maxWidth="md"
        />
      </ThemeProvider>
    );
  }
}

Attachments.propTypes = {
  classes: PropTypes.shape({
    listItem: PropTypes.string,
    truncate: PropTypes.string,
    footer: PropTypes.string,
  }),
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

Attachments.defaultProps = {
  classes: {},
  serviceUrl: '',
  pageCode: '',
  frameId: '',
};

export default withStyles(styles)(Attachments);
