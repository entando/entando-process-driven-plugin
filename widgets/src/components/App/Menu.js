import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  Divider,
} from '@material-ui/core';
import { Home as HomeIcon, List as ListIcon } from '@material-ui/icons';

import 'components/App/App.css';

const Menu = ({ open, setOpen }) => (
  <Drawer open={open} onClose={() => setOpen(false)}>
    <div className="app-list">
      <List>
        <ListItem button component={Link} to="/" onClick={() => setOpen(false)}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <Typography variant="overline">Widgets</Typography>
        <Divider />
        <ListItem button component={Link} to="/TaskList" onClick={() => setOpen(false)}>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="TaskList" />
        </ListItem>
      </List>
    </div>
  </Drawer>
);

Menu.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Menu;
