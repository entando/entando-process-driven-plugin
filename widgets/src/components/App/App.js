import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AppBar, Container, Toolbar, Typography, IconButton } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';

import 'components/App/App.css';
import Menu from 'components/App/Menu';

// widgets
import Home from 'components/App/Home';
import TaskList from 'components/TaskList/TaskList';

function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="App">
      <Router>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Entando - PAM Plugin</Typography>
          </Toolbar>
        </AppBar>

        <Menu open={open} setOpen={setOpen} />

        <Container className="app-container">
          <Route path="/" exact component={Home} />
          <Route path="/TaskList/" component={TaskList} />
        </Container>
      </Router>
    </div>
  );
}

export default App;
