import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import { DOMAINS, LOCAL } from 'api/constants';
import { getPageWidget } from 'api/app-builder/pages';
import { getProcesses } from 'api/pda/processes';
import theme from 'theme';
import Notification from 'components/common/Notification';
import withAuth from 'components/common/auth/withAuth';
import Table from 'components/common/Table/Table';

const DisplayArray = ({ row }) => (
  <span>{Array.isArray(row.userTasks) ? row.userTasks.join(', ') : row.userTasks}</span>
);

DisplayArray.propTypes = {
  row: PropTypes.shape({
    userTasks: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }).isRequired,
};

const columns = [
  {
    accessor: 'processName',
    header: 'Process Name',
  },
  {
    accessor: 'initiator',
    header: 'Created by',
  },
  {
    accessor: 'date',
    header: 'Created At',
  },
  {
    accessor: 'userTasks',
    header: 'Status',
    customCell: DisplayArray,
  },
];

const styles = {
  toolbar: {
    justifyContent: 'space-between',
    padding: 16,
    minHeight: 'unset',
  },
  title: {
    textAlign: 'left',
  },
};

export class ProcessListContainer extends React.Component {
  state = {
    processes: [],
    loading: false,
    errorAlert: null,
  };

  componentDidMount = async () => {
    const { serviceUrl, pageCode, frameId } = this.props;

    if (!LOCAL) {
      // set the PDA domain to the URL passed via props
      DOMAINS.PDA = serviceUrl;
    }

    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId);

      const { config } = widgetConfigs.payload;
      const connection = config.knowledgeSource;

      this.setState({ connection }, this.fetchProcesses);
    } catch (error) {
      this.handleError(error.message, 'messages.errors.dataLoading');
    }
  };

  fetchProcesses = async () => {
    const { connection } = this.state;

    try {
      const processes = await getProcesses(connection);
      this.setState({ processes: processes.payload });
    } catch (error) {
      this.handleError(error.message, 'messages.errors.dataLoading');
    }
  };

  handleError(err) {
    this.setState({
      errorAlert: err.toString(),
      loading: false,
    });
  }

  render() {
    const { loading, processes, errorAlert } = this.state;
    const { classes, title } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Paper>
          {title && (
            <Toolbar className={classes.toolbar}>
              <div className={classes.title}>
                <Typography variant="h2">Process List</Typography>
              </div>
            </Toolbar>
          )}

          <Table loading={loading} columns={columns} rows={processes} hidePagination />
          <Notification type="error" message={errorAlert} onClose={this.closeNotification} />
        </Paper>
      </ThemeProvider>
    );
  }
}

ProcessListContainer.propTypes = {
  classes: PropTypes.shape({
    toolbar: PropTypes.string,
    title: PropTypes.string,
  }),
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
  title: PropTypes.string,
};

ProcessListContainer.defaultProps = {
  classes: {},
  serviceUrl: '',
  pageCode: '',
  frameId: '',
  title: '',
};

export default withAuth(withStyles(styles)(ProcessListContainer), ['process-list']);
