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
// import mockedColumns from 'mocks/taskList/columns';
// import mockedRows from 'mocks/taskList/rows';
import theme from 'theme';
import Loader from 'components/common/Loader';

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
  };

  async componentDidMount() {
    const config = await configApi.get();
    console.log(config);
    const taskList = await taskListApi.get(config.connection);
    console.log(taskList);
    this.setState({
      loading: false,
      columns: normalizeColumns(config.columns),
      rows: normalizeRows(taskList.payload),
    });
  }

  render() {
    const { loading, columns, rows } = this.state;
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          {loading ? (
            <Loader />
          ) : (
            <Table
              title={i18next.t('table.title')}
              subtitle={i18next.t('table.subtitle')}
              columns={columns}
              rows={rows}
            />
          )}
        </Paper>
      </ThemeProvider>
    );
  }
}

TaskList.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }),
};

TaskList.defaultProps = {
  classes: {},
};

export default withStyles(styles)(TaskList);
