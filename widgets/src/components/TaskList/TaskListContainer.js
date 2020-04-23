import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import SVG from 'react-inlinesvg';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';

import { DOMAINS, LOCAL } from 'api/constants';
import { getTasks, TASK_BULK_ACTIONS, putTasksBulkAction } from 'api/pda/tasks';
import { getDiagram } from 'api/pda/processes';
import { getPageWidget } from 'api/app-builder/pages';
import TableBulkSelectContext from 'components/common/Table/TableBulkSelectContext';
import utils from 'utils';
import withAuth from 'components/common/auth/withAuth';
import DropDownButton from 'components/common/DropDownButton';

import {
  normalizeColumns,
  insertRowControls,
  normalizeRows,
} from 'components/TaskList/normalizeData';
import SearchInput from 'components/common/SearchInput';
import Notification from 'components/common/Notification';
import ErrorComponent from 'components/common/ErrorComponent';
import Table from 'components/common/Table/Table';
import SimpleDialog from 'components/common/SimpleDialog';
import ConfirmDialog from 'components/common/ConfirmDialog';
import theme from 'theme';

const styles = {
  toolbar: {
    justifyContent: 'space-between',
    padding: '16px 16px 8px 16px',
    minHeight: 'unset',
  },
  noSubtitleToolbar: {
    padding: '8px 16px',
  },
  bulkDropdown: {
    width: 200,
    top: -5,
  },
  title: {
    textAlign: 'left',
  },
  paper: {
    minHeight: 459,
    position: 'relative',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dropdown: {
    padding: 8,
  },
};

class TaskList extends React.Component {
  state = {
    loading: true,
    columns: [],
    rows: [],
    size: 0,
    connection: {},
    filter: '',
    blocker: '',
    errorAlert: null,
    lastPage: false,
    activeTab: 0,
    diagramModal: {
      open: false,
      title: '',
      body: '',
    },
    selectedRows: [],
    groups: [],
    page: 0,
    userDialog: {
      open: false,
      value: '',
    },
  };

  timer = { ref: null };

  componentDidMount = async () => {
    const { lazyLoading, serviceUrl, pageCode, frameId, onSelectTask } = this.props;

    if (!LOCAL) {
      // set the PDA domain to the URL passed via props
      DOMAINS.PDA = serviceUrl;
    }

    try {
      // config will be fetched from app-builder
      const widgetConfigs = await getPageWidget(pageCode, frameId, 'TASK_LIST');
      if (widgetConfigs.errors && widgetConfigs.errors.length) {
        throw widgetConfigs.errors[0];
      }
      if (!widgetConfigs.payload) {
        throw new Error('messages.errors.widgetConfig');
      }

      const { config } = widgetConfigs.payload;
      const connection = config.knowledgeSource;
      const { groups: storedGroups } = this.state;

      const groups = config.groups
        ? JSON.parse(config.groups)
            .filter(group => group.checked)
            .map(group => group.key)
        : storedGroups;

      const taskList = lazyLoading
        ? await getTasks({ connection, groups }, 0, 10)
        : await getTasks({ connection, groups });

      if (!taskList.payload) {
        throw new Error('messages.errors.errorResponse');
      }

      if (!taskList.payload.length) {
        this.setState({ blocker: 'taskList.emptyList' });
      } else {
        const options = config.options ? JSON.parse(config.options) : [];
        const rows = normalizeRows(taskList.payload);
        const { columns: storedColumns } = this.state;

        // dispatch onSelectTask event for the first item on list
        onSelectTask({ ...rows[0], pos: 0, groups });

        const columns = normalizeColumns(
          config.columns ? JSON.parse(config.columns) : storedColumns,
          rows[0]
        );

        this.setState({
          loading: false,
          columns: insertRowControls(columns, options, {
            openDiagram: this.openDiagram,
            selectTask: onSelectTask,
          }),
          rows,
          lastPage: taskList.metadata.lastPage === 1,
          size: taskList.metadata.size,
          connection: config.knowledgeSource,
          groups,
        });
      }
    } catch (error) {
      this.handleError(error.message, 'messages.errors.dataLoading');
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
    const { connection, groups } = this.state;

    if (withDelay) {
      clearTimeout(this.timer.ref);
      await utils.timeout(800, this.timer);
    }

    this.setState({ loading: true });
    try {
      const res = await getTasks(
        { connection, groups },
        page,
        rowsPerPage,
        sortedColumn,
        sortedOrder,
        filter
      );
      if (!res.payload) {
        throw res.message;
      }

      this.setState({
        rows: normalizeRows(res.payload),
        size: res.metadata.size,
        lastPage: res.metadata.lastPage === 1,
        loading: false,
      });
      callback();
    } catch (error) {
      this.handleError(error, 'messages.errors.dataLoading');
      this.setState({ loading: false });
    }
  };

  openDiagram = row => async () => {
    const { connection } = this.state;

    if (row.processId && row.id) {
      const process = `${row.processId}@${row.id.split('@')[1]}`;
      this.setState({ loading: true });
      try {
        const diagram = await getDiagram(connection, process);
        this.setState({
          diagramModal: {
            title: `${i18next.t('taskList.diagramModalTitle')}: ${process}`,
            body: <SVG src={diagram} />,
            open: true,
          },
        });
      } catch (error) {
        this.handleError(error);
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  onCloseDiagramModal = () => {
    const { diagramModal } = this.state;
    this.setState({ diagramModal: { ...diagramModal, open: false } });
  };

  closeNotification = () => {
    this.setState({ errorAlert: null });
  };

  changeBulkAction = (value, user) => {
    const { connection, selectedRows, page } = this.state;
    const { lazyLoading } = this.props;
    this.setState({ loading: true }, async () => {
      try {
        await putTasksBulkAction(connection, value, selectedRows, user);
        this.setState({ selectedRows: [] }, () => this.updateRows(lazyLoading ? page : undefined));
      } catch (error) {
        this.handleError(error);
      }
    });
  };

  toggleUserDialog = () => {
    this.setState(state => ({
      userDialog: {
        value: '',
        open: !state.userDialog.open,
      },
    }));
  };

  handleChangeUser = ({ target: { value } }) => {
    this.setState(state => ({
      userDialog: {
        ...state.userDialog,
        value,
      },
    }));
  };

  handleClickBulkAction = value => {
    const val = value.toLowerCase();
    if (val === TASK_BULK_ACTIONS[0]) {
      this.toggleUserDialog();
    } else {
      this.changeBulkAction(val);
    }
  };

  handleChangeFilter = event => {
    const { lazyLoading } = this.props;
    const { rowsPerPage, sortedColumn, sortOrder } = this.state;
    const filter = event.target.value;

    this.setState({ filter });
    if (lazyLoading) {
      this.updateRows(0, rowsPerPage, sortedColumn, sortOrder, filter, undefined, true);
    }
  };

  handleChangeTab = (_, activeTab) => {
    this.setState({ activeTab });
  };

  handleChangePage = (page, rowsPerPage) => {
    this.setState({
      page,
      ...(rowsPerPage ? { rowsPerPage } : {}),
    });
  };

  handleRowClicked = (row, idx, e) => {
    const { onSelectTask } = this.props;
    const { page, rowsPerPage } = this.state;
    const pos = page * (rowsPerPage || 10) + idx;
    if (e.target.type !== 'checkbox') {
      onSelectTask({ ...row, pos });
    }
  };

  handleRowSelectAll = () => {
    const { rows } = this.state;
    const { rowAccessor } = this.props;
    const selectedRows = rows.map(row => row[rowAccessor]);
    this.setState({ selectedRows });
  };

  handleRowSelectNone = () => this.setState({ selectedRows: [] });

  handleRowToggleItem = row => {
    const { rowAccessor } = this.props;
    const { selectedRows } = this.state;
    const rowId = row[rowAccessor];
    const nSet = new Set(selectedRows);
    if (nSet.has(rowId)) {
      nSet.delete(rowId);
    } else {
      nSet.add(rowId);
    }
    this.setState({ selectedRows: Array.from(nSet) });
  };

  handleError(err, blocker = '') {
    const { onError } = this.props;
    onError(err);
    this.setState({
      errorAlert: err.toString(),
      blocker,
      loading: false,
    });
  }

  render() {
    const {
      loading,
      columns,
      rows,
      size,
      blocker,
      errorAlert,
      lastPage,
      diagramModal,
      filter,
      activeTab,
      selectedRows,
      userDialog,
    } = this.state;
    const { classes, lazyLoading, rowAccessor } = this.props;

    let lazyLoadingProps;
    if (lazyLoading) {
      lazyLoadingProps = {
        onChange: this.updateRows,
        size,
        lastPage,
      };
    }

    const selectedRowsSet = new Set(selectedRows);

    return (
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          {blocker ? (
            <ErrorComponent message={blocker} />
          ) : (
            <>
              <Toolbar className={classes.toolbar}>
                <div className={classes.title}>
                  <Typography variant="h2">{i18next.t('table.title')}</Typography>
                </div>
                <SearchInput value={filter} onChange={this.handleChangeFilter} />
              </Toolbar>
              <div className={classes.tabs}>
                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={this.handleChangeTab}
                  value={activeTab}
                >
                  <Tab label={i18next.t('taskList.tabs.myTasks')} />
                </Tabs>
                <div className={classes.dropdown}>
                  <DropDownButton
                    disabled={!selectedRowsSet.size}
                    options={TASK_BULK_ACTIONS.map(
                      action => `${action.charAt(0).toUpperCase()}${action.slice(1)}`
                    )}
                    onClick={this.handleClickBulkAction}
                  />
                </div>
              </div>
              <TableBulkSelectContext.Provider
                value={{
                  selectedRows: selectedRowsSet,
                  onSelectAll: this.handleRowSelectAll,
                  onSelectNone: this.handleRowSelectNone,
                  onToggleItem: this.handleRowToggleItem,
                  rowAccessor,
                }}
              >
                <Table
                  loading={loading}
                  columns={columns}
                  rows={rows}
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  lazyLoadingProps={lazyLoadingProps}
                  onRowClick={this.handleRowClicked}
                  onChangePage={this.handleChangePage}
                />
              </TableBulkSelectContext.Provider>
            </>
          )}
        </Paper>
        <SimpleDialog
          open={diagramModal.open}
          title={diagramModal.title}
          body={diagramModal.body}
          onClose={this.onCloseDiagramModal}
          maxWidth="xl"
          fullWidth
        />
        <ConfirmDialog
          open={userDialog.open}
          title={i18next.t('taskList.selectAssign')}
          message={
            <TextField
              type="text"
              value={userDialog.value}
              onChange={this.handleChangeUser}
              fullWidth
            />
          }
          onClose={this.toggleUserDialog}
          onConfirm={() => {
            this.changeBulkAction(TASK_BULK_ACTIONS[0], userDialog.value);
            this.toggleUserDialog();
          }}
        />
        <Notification type="error" message={errorAlert} onClose={this.closeNotification} />
      </ThemeProvider>
    );
  }
}

TaskList.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
    toolbar: PropTypes.string,
    title: PropTypes.string,
    bulkDropdown: PropTypes.string,
    tabs: PropTypes.string,
    dropdown: PropTypes.string,
  }),
  lazyLoading: PropTypes.bool,
  onError: PropTypes.func,
  onSelectTask: PropTypes.func,
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
  rowAccessor: PropTypes.string,
};

TaskList.defaultProps = {
  classes: {},
  lazyLoading: true,
  onError: () => {},
  onSelectTask: () => {},
  serviceUrl: '',
  pageCode: '',
  frameId: '',
  rowAccessor: 'id',
};

const TaskListContainer = withStyles(styles)(TaskList);

export default withAuth(TaskListContainer, ['task-list', 'process-diagram']);
