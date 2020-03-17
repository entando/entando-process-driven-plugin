/* eslint-disable no-console */
/* eslint-disable react/jsx-wrap-multilines */
import { Container, IconButton, Grid, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import { DOMAINS, LOCAL } from 'api/constants';
import {
  getConnections,
  deleteConnection,
  testConnection,
  saveConnection,
  createConnection,
} from 'api/pda/connections';
import theme from 'theme';
import WidgetBox from 'components/common/WidgetBox';
import ConnectionItem from 'components/Connections/ConnectionItem';
import ConnectionItemSkeleton from 'components/Connections/ConnectionItemSkeleton';
import ConnectionForm from 'components/Connections/ConnectionForm';
import Notification from 'components/common/Notification';
import Loader from 'components/common/Loader';

const styles = {
  gridContainer: {
    marginTop: 10,
  },
};

const initialForm = {
  name: '',
  engine: '',
  schema: '',
  host: '',
  app: '',
  username: '',
  password: '',
};

class ConnectionsContainer extends React.Component {
  state = {
    connectionsList: [],
    showForm: false,
    formData: initialForm,
    listLoader: true,
    loader: false,
    notification: {
      message: '',
      type: 'error',
    },
  };

  componentDidMount = () => {
    const { serviceUrl } = this.props;

    if (!LOCAL) {
      // set the PDA domain to the URL passed via props
      DOMAINS.PDA = serviceUrl;
    }

    this.fetchConnections();
  };

  fetchConnections = async () => {
    const { payload: connectionsList } = await getConnections();

    this.setState({ connectionsList, listLoader: false });
  };

  handleAddButton = () => {
    this.setState({ showForm: true });
  };

  handleFormChange = form => ({ target: { value } }) => {
    const { formData: old } = this.state;
    const formData = { ...old, [form]: value };
    this.setState({ formData });
  };

  handleCancelForm = () => {
    this.setState({ formData: initialForm, showForm: false });
  };

  handleSave = async () => {
    const { formData } = this.state;
    try {
      const response = formData.edit
        ? await saveConnection(formData)
        : await createConnection(formData);

      if (response.payload) {
        this.setState(
          {
            showForm: false,
            notification: { message: i18next.t('messages.success.saved'), type: 'success' },
          },
          this.fetchConnections
        );
      }
    } catch (error) {
      this.setState({ notification: { message: error.message, type: 'error' } });
    }
  };

  handleEdit = form => () => {
    const formData = { ...initialForm, ...form, edit: true };
    this.setState({ formData, showForm: true });
  };

  handleDelete = con => async () => {
    this.setState({ loader: true });
    try {
      await deleteConnection(con);
      this.fetchConnections();
    } catch (error) {
      this.setState({ notification: { message: error.message, type: 'error' } });
    } finally {
      this.setState({ loader: false });
    }
  };

  handleTestConnection = con => async () => {
    const { connectionsList: list } = this.state;
    let connectionsList;

    this.setState({ loader: true });

    try {
      await testConnection(con);
      connectionsList = list.map(item =>
        item.name === con ? { ...item, online: 'online' } : item
      );
    } catch (error) {
      connectionsList = list.map(item =>
        item.name === con ? { ...item, online: 'offline' } : item
      );
    }
    this.setState({ connectionsList, loader: false });
  };

  handleCloseNotifications = () => {
    this.setState({ notification: { message: '' } });
  };

  render() {
    const { classes } = this.props;
    const { connectionsList, showForm, formData, listLoader, loader, notification } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <WidgetBox
            title="Connections"
            topRightComp={
              <IconButton color="primary" onClick={this.handleAddButton}>
                <AddIcon />
              </IconButton>
            }
            open={showForm}
            hasDivider
          >
            <ConnectionForm
              form={formData}
              onChange={this.handleFormChange}
              onCancel={this.handleCancelForm}
              onSave={this.handleSave}
            />
          </WidgetBox>

          <Grid className={classes.gridContainer} container spacing={2}>
            {listLoader &&
              Array(4)
                .fill('')
                // eslint-disable-next-line react/no-array-index-key
                .map((_, i) => <ConnectionItemSkeleton key={i} />)}
            {connectionsList ? (
              connectionsList.map(connection => (
                <ConnectionItem
                  key={connection.name}
                  connection={connection}
                  onEdit={this.handleEdit}
                  onDelete={this.handleDelete}
                  onTest={this.handleTestConnection}
                />
              ))
            ) : (
              <Typography>No connections found.</Typography>
            )}
          </Grid>
          <Loader loading={loader} />
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={this.handleCloseNotifications}
          />
        </Container>
      </ThemeProvider>
    );
  }
}

ConnectionsContainer.propTypes = {
  classes: PropTypes.shape({
    gridContainer: PropTypes.string,
  }).isRequired,
  serviceUrl: PropTypes.string,
};

ConnectionsContainer.defaultProps = {
  serviceUrl: '',
};

export default withStyles(styles)(ConnectionsContainer);
