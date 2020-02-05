import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  AppBar,
  Checkbox,
  Container,
  FormControlLabel,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { authenticate } from 'api/app-builder/pages';
import WIDGETS_CONFIG from 'mocks/app-builder/widgets';
import Menu from 'components/App/Menu';

import 'components/App/App.css';

// widgets
import Home from 'components/App/Home';

import TaskListConfig from 'components/TaskList/TaskListConfig';

import TaskDetailsConfig from 'components/TaskDetails/TaskDetailsConfig';

import TaskCompletionFormConfig from 'components/TaskCompletionForm/TaskCompletionFormConfig';

import TaskCommentsConfig from 'components/TaskComments/TaskCommentsConfig';

import SummaryCardContainer from 'components/SummaryCard/SummaryCardContainer';
import SummaryCardConfig from 'components/SummaryCard/SummaryCardConfig';

import ProcessFormContainer from 'components/ProcessForm/ProcessFormContainer';
import ProcessFormConfig from 'components/ProcessForm/ProcessFormConfig';

const useStyles = makeStyles(theme => ({
  appBar: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const [open, setOpen] = React.useState(false);
  const [lazyLoading, setLazyLoading] = React.useState(true);
  const [skeletonLoading, setSkeletonLoading] = React.useState(false);

  // TODO: Remove when token is managed by wrapper
  React.useEffect(() => {
    async function fetchToken() {
      // temporary fetch token for ease of development
      console.log('Fetching authentication token for ease of development! DEV ONLY'); // eslint-disable-line no-console

      const authentication = await authenticate();
      if (authentication && authentication.access_token) {
        console.log('New authentication token is:', authentication.access_token); // eslint-disable-line no-console
        localStorage.setItem('token', authentication.access_token);
      }
    }
    fetchToken();
  }, []);

  const classes = useStyles();

  return (
    <div className="App">
      <Router>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(true)}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Entando - PAM Plugin
            </Typography>
            <FormControlLabel
              control={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <Checkbox
                  checked={skeletonLoading}
                  onChange={() => setSkeletonLoading(!skeletonLoading)}
                />
              }
              label="Show skeleton"
              labelPlacement="start"
            />
            <FormControlLabel
              control={
                <Checkbox checked={lazyLoading} onChange={() => setLazyLoading(!lazyLoading)} />
              }
              label="Lazy Loading"
              labelPlacement="start"
            />
          </Toolbar>
        </AppBar>

        <Menu open={open} setOpen={setOpen} />

        <Container className="app-container">
          <Route path="/" exact component={Home} />
          <Route
            path="/TaskList/"
            render={() => (
              <task-list
                lazy-loading={lazyLoading}
                page-code={WIDGETS_CONFIG.TASK_LIST.pageCode}
                frame-id={WIDGETS_CONFIG.TASK_LIST.frameId}
                service-url={WIDGETS_CONFIG.TASK_LIST.serviceUrl}
              />
            )}
          />
          <Route
            path="/TaskListConfig"
            render={() => (
              <TaskListConfig
                pageCode={WIDGETS_CONFIG.TASK_LIST.pageCode}
                frameId={WIDGETS_CONFIG.TASK_LIST.frameId}
                widgetCode={WIDGETS_CONFIG.TASK_LIST.widgetCode}
              />
            )}
          />
          <Route
            path="/TaskDetails/"
            render={() => (
              <task-details
                task-id={WIDGETS_CONFIG.TASK_DETAILS.taskId}
                page-code={WIDGETS_CONFIG.TASK_DETAILS.pageCode}
                frame-id={WIDGETS_CONFIG.TASK_DETAILS.frameId}
                service-url={WIDGETS_CONFIG.TASK_DETAILS.serviceUrl}
              />
            )}
          />
          <Route
            path="/TaskDetailsConfig"
            render={() => (
              <TaskDetailsConfig
                pageCode={WIDGETS_CONFIG.TASK_DETAILS.pageCode}
                frameId={WIDGETS_CONFIG.TASK_DETAILS.frameId}
                widgetCode={WIDGETS_CONFIG.TASK_DETAILS.widgetCode}
              />
            )}
          />
          <Route
            path="/TaskCompletionForm/"
            render={() => (
              <task-completion-form
                task-id={WIDGETS_CONFIG.COMPLETION_FORM.taskId}
                page-code={WIDGETS_CONFIG.COMPLETION_FORM.pageCode}
                frame-id={WIDGETS_CONFIG.COMPLETION_FORM.frameId}
                service-url={WIDGETS_CONFIG.COMPLETION_FORM.serviceUrl}
              />
            )}
          />
          <Route
            path="/TaskCompletionFormConfig"
            render={() => (
              <TaskCompletionFormConfig
                pageCode={WIDGETS_CONFIG.COMPLETION_FORM.pageCode}
                frameId={WIDGETS_CONFIG.COMPLETION_FORM.frameId}
                widgetCode={WIDGETS_CONFIG.COMPLETION_FORM.widgetCode}
              />
            )}
          />
          <Route
            path="/TaskComments/"
            render={() => (
              <task-comments
                task-id={WIDGETS_CONFIG.TASK_COMMENTS.taskId}
                page-code={WIDGETS_CONFIG.TASK_COMMENTS.pageCode}
                frame-id={WIDGETS_CONFIG.TASK_COMMENTS.frameId}
                service-url={WIDGETS_CONFIG.TASK_COMMENTS.serviceUrl}
              />
            )}
          />
          <Route
            path="/TaskCommentsConfig"
            render={() => (
              <TaskCommentsConfig
                pageCode={WIDGETS_CONFIG.TASK_COMMENTS.pageCode}
                frameId={WIDGETS_CONFIG.TASK_COMMENTS.frameId}
                widgetCode={WIDGETS_CONFIG.TASK_COMMENTS.widgetCode}
              />
            )}
          />
          <Route
            path="/SummaryCard/"
            render={() => (
              <SummaryCardContainer
                pageCode={WIDGETS_CONFIG.SUMMARY_CARD.pageCode}
                frameId={WIDGETS_CONFIG.SUMMARY_CARD.frameId}
                widgetCode={WIDGETS_CONFIG.SUMMARY_CARD.widgetCode}
              />
            )}
          />
          <Route
            path="/SummaryCardConfig/"
            render={() => (
              <SummaryCardConfig
                pageCode={WIDGETS_CONFIG.SUMMARY_CARD.pageCode}
                frameId={WIDGETS_CONFIG.SUMMARY_CARD.frameId}
                widgetCode={WIDGETS_CONFIG.SUMMARY_CARD.widgetCode}
              />
            )}
          />
          <Route
            path="/ProcessForm"
            render={() => (
              <ProcessFormContainer
                pageCode={WIDGETS_CONFIG.PROCESS_FORM.pageCode}
                frameId={WIDGETS_CONFIG.PROCESS_FORM.frameId}
                widgetCode={WIDGETS_CONFIG.PROCESS_FORM.widgetCode}
              />
            )}
          />
          <Route
            path="/ProcessFormConfig"
            render={() => (
              <ProcessFormConfig
                pageCode={WIDGETS_CONFIG.PROCESS_FORM.pageCode}
                frameId={WIDGETS_CONFIG.PROCESS_FORM.frameId}
                widgetCode={WIDGETS_CONFIG.PROCESS_FORM.widgetCode}
              />
            )}
          />
        </Container>
      </Router>
    </div>
  );
}

export default App;
