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
  IconButton,
} from '@material-ui/core';
import {
  Home as HomeIcon,
  List as ListIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  DoneAll as DoneAllIcon,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  item: {
    position: 'relative',
  },
  iconButton: {
    position: 'absolute',
    right: 5,
    top: 11,
  },
};

const Menu = ({ open, setOpen, classes }) => (
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
        <div className={classes.item}>
          <ListItem button component={Link} to="/TaskList" onClick={() => setOpen(false)}>
            <ListIcon />
            <ListItemText primary="TaskList" />
          </ListItem>
          <IconButton
            className={classes.iconButton}
            size="small"
            component={Link}
            to="/TaskListConfig"
            onClick={() => setOpen(false)}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={classes.item}>
          <ListItem button component={Link} to="/TaskDetails" onClick={() => setOpen(false)}>
            <DescriptionIcon />
            <ListItemText primary="TaskDetails" />
          </ListItem>
          <IconButton
            className={classes.iconButton}
            size="small"
            component={Link}
            to="/TaskDetailsConfig"
            onClick={() => setOpen(false)}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={classes.item}>
          <ListItem button component={Link} to="/TaskCompletionForm" onClick={() => setOpen(false)}>
            <DoneAllIcon />
            <ListItemText primary="TaskCompletionForm" />
          </ListItem>
          <IconButton
            className={classes.iconButton}
            size="small"
            component={Link}
            to="/TaskCompletionFormConfig"
            onClick={() => setOpen(false)}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={classes.item}>
          <ListItem button component={Link} to="/SummaryCard" onClick={() => setOpen(false)}>
            <DashboardIcon />
            <ListItemText primary="SummaryCard" />
          </ListItem>
          <IconButton
            className={classes.iconButton}
            size="small"
            component={Link}
            to="/SummaryCardConfig"
            onClick={() => setOpen(false)}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </div>
        <div className={classes.item}>
          <ListItem button component={Link} to="/ProcessForm" onClick={() => setOpen(false)}>
            <DescriptionIcon />
            <ListItemText primary="ProcessForm" />
          </ListItem>
          <IconButton
            className={classes.iconButton}
            size="small"
            component={Link}
            to="/ProcessFormConfig"
            onClick={() => setOpen(false)}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </div>
      </List>
    </div>
  </Drawer>
);

Menu.propTypes = {
  classes: PropTypes.shape({
    item: PropTypes.string,
    iconButton: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

Menu.defaultProps = {
  classes: {},
};

export default withStyles(styles)(Menu);
