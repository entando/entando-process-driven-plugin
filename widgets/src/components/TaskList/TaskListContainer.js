import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

import { SERVICE } from 'api/constants';
import { getTasks } from 'api/taskList';
import { getPageWidget } from 'api/app-builder/pages';
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
    const { lazyLoading, serviceUrl, pageCode, frameId } = this.props;
    const { currentPage } = this.state;

    SERVICE.URL = serviceUrl;

    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId);
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }
      const { config } = widgetConfigs.payload;

      const taskList = lazyLoading
        ? await getTasks(config.knowledgeSource, currentPage, 10)
        : await getTasks(config.knowledgeSource);

      this.setState({
        loading: false,
        columns: normalizeColumns(JSON.parse(config.columns), taskList.payload[0]),
        rows: normalizeRows(taskList.payload),
        size: taskList.metadata.size,
        connection: config.knowledgeSource,
      });
    } catch (error) {
      this.handleError(error.message);
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
      const res = await getTasks(connection, page, rowsPerPage, sortedColumn, sortedOrder, filter);

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
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

TaskList.defaultProps = {
  classes: {},
  lazyLoading: false,
  onError: () => {},
  serviceUrl: '/pda',
  pageCode: '',
  frameId: '',
};

export default withStyles(styles)(TaskList);
