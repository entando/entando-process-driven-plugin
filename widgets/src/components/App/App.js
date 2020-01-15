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
import Menu from 'components/App/Menu';
import 'components/App/App.css';

// widgets
import Home from 'components/App/Home';

import TaskListContainer from 'components/TaskList/TaskListContainer';
import TaskListConfig from 'components/TaskList/TaskListConfig';

import TaskDetailsContainer from 'components/TaskDetails/TaskDetailsContainer';
import TaskDetailsConfig from 'components/TaskDetails/TaskDetailsConfig';

import TaskCompletionFormContainer from 'components/TaskCompletionForm/TaskCompletionFormContainer';
import TaskCompletionFormConfig from 'components/TaskCompletionForm/TaskCompletionFormConfig';

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
  const [lazyLoading, setLazyLoading] = React.useState(false);

  // TODO: Remove when token is managed by wrapper
  React.useEffect(() => {
    async function fetchToken() {
      // temporary fetch token for ease of development
      console.log('Fetching auth token for ease of development! DEV ONLY');

      const authentication = await authenticate();
      if (authentication && authentication.access_token) {
        console.log('New authenticaton token is:', authentication.access_token);
        localStorage.setItem('token', authentication.access_token);
      }
    }
    fetchToken();
  });

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
          <Route path="/TaskList/" render={() => <TaskListContainer lazyLoading={lazyLoading} />} />
          <Route
            path="/TaskListConfig"
            render={() => <TaskListConfig pageCode="0" framePos="0" widgetCode="pda_task_list" />}
          />
          <Route
            path="/TaskDetails/"
            render={() => (
              <TaskDetailsContainer taskId="290" pageCode="phase_1_widgets" frameId="4" />
            )}
          />
          <Route
            path="/TaskDetailsConfig"
            render={() => (
              <TaskDetailsConfig
                pageCode="phase_1_widgets"
                frameId="4"
                widgetCode="phase_1_widgets_task_details"
              />
            )}
          />
          <Route
            path="/TaskCompletionForm/"
            render={() => (
              <TaskCompletionFormContainer taskId="290" pageCode="phase_1_widgets" frameId="2" />
            )}
          />
          <Route
            path="/TaskCompletionFormConfig"
            render={() => (
              <TaskCompletionFormConfig
                pageCode="phase_1_widgets"
                frameId="2"
                widgetCode="phase_1_widgets_completion_form"
              />
            )}
          />
        </Container>
      </Router>
    </div>
  );
}

export default App;
