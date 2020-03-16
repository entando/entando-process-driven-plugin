/* eslint-disable no-console */
/* eslint-disable react/jsx-wrap-multilines */
import { Container, IconButton, Grid, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import PropTypes from 'prop-types';
// import i18next from 'i18next';

import {
  getConnections,
  deleteConnection,
  testConnection,
  saveConnection,
  createConnection,
} from 'api/pda/connections';
import WidgetBox from 'components/common/WidgetBox';
import ConnectionItem from 'components/Connections/ConnectionItem';
import ConnectionItemSkeleton from 'components/Connections/ConnectionItemSkeleton';
import ConnectionForm from 'components/Connections/ConnectionForm';
import theme from 'theme';
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
  };

  componentDidMount = () => {
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
    console.log(formData);
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
        this.fetchConnections();
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleEdit = form => () => {
    const formData = { ...form, edit: true };
    this.setState({ formData, showForm: true });
  };

  handleDelete = con => () => {
    deleteConnection(con);
    this.fetchConnections();
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

  render() {
    const { classes } = this.props;
    const { connectionsList, showForm, formData, listLoader, loader } = this.state;

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
        </Container>
      </ThemeProvider>
    );
  }
}

ConnectionsContainer.propTypes = {
  classes: PropTypes.shape({
    gridContainer: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(ConnectionsContainer);
