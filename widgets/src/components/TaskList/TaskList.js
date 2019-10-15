import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/styles/withStyles';

import configApi from 'api/config';
import taskListApi from 'api/taskList';

import { normalizeColumns, normalizeRows } from 'components/TaskList/normalizeData';
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
  };

  componentDidMount = async () => {
    const { async } = this.props;
    const { currentPage } = this.state;

    const config = await configApi.get();
    console.log(config);

    const taskList = async
      ? await taskListApi.get(config.connection, currentPage, 10)
      : await taskListApi.get(config.connection);
    console.log(taskList);

    this.setState({
      loading: false,
      columns: normalizeColumns(config.columns),
      rows: normalizeRows(taskList.payload),
      size: taskList.metadata.size,
      connection: config.connection,
    });
  };

  updateRows = async (page, rowsPerPage = 5, callback = () => {}, sortedColumn, sortedOrder) => {
    const { connection } = this.state;

    this.setState({ loading: true });
    const res = await taskListApi.get(connection, page, rowsPerPage, sortedColumn, sortedOrder);

    this.setState({
      rows: normalizeRows(res.payload),
      size: res.metadata.size,
      currentPage: page || 0,
      loading: false,
    });
    callback();
  };

  render() {
    const { loading, columns, rows, currentPage, size } = this.state;
    const { classes, async } = this.props;

    let lazyLoadingProps;
    if (async) {
      lazyLoadingProps = {
        currentPage,
        onChange: this.updateRows,
        size,
      };
    }

    return (
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          <Table
            loading={loading}
            title={i18next.t('table.title')}
            subtitle={i18next.t('table.subtitle')}
            columns={columns}
            rows={rows}
            rowsPerPageOptions={[10, 25, 50, 100]}
            lazyLoadingProps={lazyLoadingProps}
          />
        </Paper>
      </ThemeProvider>
    );
  }
}

TaskList.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }),
  async: PropTypes.bool,
};

TaskList.defaultProps = {
  classes: {},
  async: false,
};

export default withStyles(styles)(TaskList);
