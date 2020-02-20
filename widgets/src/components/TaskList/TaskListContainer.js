import { MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import SVG from 'react-inlinesvg';

import { DOMAINS, LOCAL } from 'api/constants';
import { getTasks } from 'api/pda/tasks';
import { getDiagram } from 'api/pda/processes';
import { getPageWidget } from 'api/app-builder/pages';
import utils from 'utils';

import { normalizeColumns, normalizeRows } from 'components/TaskList/normalizeData';
import ErrorNotification from 'components/common/ErrorNotification';
import ErrorComponent from 'components/common/ErrorComponent';
import Table from 'components/common/Table/Table';
import SimpleDialog from 'components/common/SimpleDialog';
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
    connection: {},
    blocker: '',
    errorAlert: null,
    lastPage: false,
    diagramModal: {
      open: false,
      title: '',
      body: '',
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

      const taskList = lazyLoading
        ? await getTasks(config.knowledgeSource, 0, 10)
        : await getTasks(config.knowledgeSource);

      const options = JSON.parse(config.options);
      const rows = normalizeRows(taskList.payload);

      // dispatch onSelectTask event for the first item on list
      onSelectTask(rows[0]);

      if (!taskList.payload) {
        throw new Error('messages.errors.errorResponse');
      }

      if (!taskList.payload.length) {
        this.setState({ blocker: 'taskList.emptyList' });
      } else {
        this.setState({
          loading: false,
          columns: normalizeColumns(JSON.parse(config.columns), rows[0], options, {
            openDiagram: this.openDiagram,
            selectTask: onSelectTask,
          }),
          rows,
          lastPage: taskList.metadata.lastPage === 1,
          size: taskList.metadata.size,
          connection: config.knowledgeSource,
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
    const { connection } = this.state;

    if (withDelay) {
      clearTimeout(this.timer.ref);
      await utils.timeout(800, this.timer);
    }

    this.setState({ loading: true });
    try {
      const res = await getTasks(connection, page, rowsPerPage, sortedColumn, sortedOrder, filter);
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

  handleError(err, blocker = '') {
    const { onError } = this.props;
    onError(err);
    this.setState({
      errorAlert: err.toString(),
      blocker,
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
    } = this.state;
    const { classes, lazyLoading } = this.props;

    let lazyLoadingProps;
    if (lazyLoading) {
      lazyLoadingProps = {
        onChange: this.updateRows,
        size,
        lastPage,
      };
    }

    return (
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          {blocker && <ErrorComponent message={blocker} />}
          {!blocker && (
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
        <SimpleDialog
          open={diagramModal.open}
          title={diagramModal.title}
          body={diagramModal.body}
          onClose={this.onCloseDiagramModal}
          maxWidth="xl"
          fullWidth
        />
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
  onSelectTask: PropTypes.func,
  serviceUrl: PropTypes.string,
  pageCode: PropTypes.string,
  frameId: PropTypes.string,
};

TaskList.defaultProps = {
  classes: {},
  lazyLoading: true,
  onError: () => {},
  onSelectTask: () => {},
  serviceUrl: '',
  pageCode: '',
  frameId: '',
};

export default withStyles(styles)(TaskList);
