import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/styles/withStyles';

import { WIDGET_CODES } from 'api/constants';
import configApi from 'api/config';
import taskListApi from 'api/taskList';
import utils from 'utils';

import { normalizeColumns, normalizeRows } from 'components/TaskList/normalizeData';
import ErrorNotification from 'components/common/ErrorNotification';
import ErrorComponent from 'components/common/ErrorComponent';
import Table from 'components/common/Table/Table';
import theme from 'theme';

const styles = {
  paper: {
    minHeight: 459,
    position: 'relative',
  },
};

class TaskList extends React.Component {
  state = {
    loading: true,
    columns: [],
    rows: [],
    size: 0,
    currentPage: 0,
    connection: {},
    error: null,
    errorAlert: null,
  };

  timer = { ref: null };

  componentDidMount = async () => {
    const { lazyLoading } = this.props;
    const { currentPage } = this.state;

    try {
      const config = await configApi.get(WIDGET_CODES.taskList);
      console.log(config);

      const taskList = lazyLoading
        ? await taskListApi.get(config.connection, currentPage, 10)
        : await taskListApi.get(config.connection);
      console.log(taskList);

      this.setState({
        loading: false,
        columns: normalizeColumns(config.columns, taskList.payload[0]),
        rows: normalizeRows(taskList.payload),
        size: taskList.metadata.size,
        connection: config.connection,
      });
    } catch (error) {
      this.handleError(error);
    }
  };

  componentDidUpdate = prevProps => {
    const { lazyLoading } = this.props;
    if (prevProps.lazyLoading !== lazyLoading) {
      this.updateRows(lazyLoading ? 0 : undefined);
    }
  };

  updateRows = async (
    page,
    rowsPerPage = 10,
    sortedColumn,
    sortedOrder,
    filter,
    callback = () => {},
    withDelay
  ) => {
    const { connection } = this.state;

    if (withDelay) {
      clearTimeout(this.timer.ref);
      await utils.timeout(800, this.timer);
    }

    this.setState({ loading: true });
    try {
      const res = await taskListApi.get(
        connection,
        page,
        rowsPerPage,
        sortedColumn,
        sortedOrder,
        filter
      );

      this.setState({
        rows: normalizeRows(res.payload),
        size: res.metadata.size,
        currentPage: page || 0,
        loading: false,
      });
      callback();
    } catch (error) {
      this.handleError(error);
      this.setState({ loading: false });
    }
  };

  closeNotification = () => {
    this.setState({ errorAlert: null });
  };

  handleError(err) {
    const { onError } = this.props;
    onError(err);
    this.setState({
      error: true,
      errorAlert: err,
    });
  }

  render() {
    const { loading, columns, rows, currentPage, size, error, errorAlert } = this.state;
    const { classes, lazyLoading } = this.props;

    let lazyLoadingProps;
    if (lazyLoading) {
      lazyLoadingProps = {
        currentPage,
        onChange: this.updateRows,
        size,
      };
    }

    return (
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          {error ? (
            <ErrorComponent message={i18next.t('messages.errors.dataLoading')} />
          ) : (
            <Table
              loading={loading}
              title={i18next.t('table.title')}
              subtitle={i18next.t('table.subtitle')}
              columns={columns}
              rows={rows}
              rowsPerPageOptions={[10, 25, 50, 100]}
              lazyLoadingProps={lazyLoadingProps}
            />
          )}
        </Paper>
        <ErrorNotification message={errorAlert} onClose={this.closeNotification} />
      </ThemeProvider>
    );
  }
}

TaskList.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }),
  lazyLoading: PropTypes.bool,
  onError: PropTypes.func,
};

TaskList.defaultProps = {
  classes: {},
  lazyLoading: false,
  onError: () => {},
};

export default withStyles(styles)(TaskList);
