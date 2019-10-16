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

import 'components/App/App.css';
import Menu from 'components/App/Menu';

// widgets
import Home from 'components/App/Home';
import TaskList from 'components/TaskList/TaskList';

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
  const [async, setAsync] = React.useState(false);
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
              control={<Checkbox checked={async} onChange={() => setAsync(!async)} />}
              label="Async"
              labelPlacement="start"
            />
          </Toolbar>
        </AppBar>

        <Menu open={open} setOpen={setOpen} />

        <Container className="app-container">
          <Route path="/" exact component={Home} />
          <Route path="/TaskList/" render={() => <TaskList async={async} />} />
        </Container>
      </Router>
    </div>
  );
}

export default App;
