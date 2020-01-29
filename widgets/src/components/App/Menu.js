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
  Description as DescriptionIcon,
  DoneAll as DoneAllIcon,
  Comment as CommentsIcon,
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

const menuItems = [
  {
    linkTo: '/TaskList',
    linkText: 'Task list',
    Icon: <ListIcon />,
    configLinkTo: '/TaskListConfig',
  },
  {
    linkTo: '/TaskDetails',
    linkText: 'Task details',
    Icon: <DescriptionIcon />,
    configLinkTo: '/TaskDetailsConfig',
  },
  {
    linkTo: '/TaskCompletionForm',
    linkText: 'Task completion form',
    Icon: <DoneAllIcon />,
    configLinkTo: '/TaskCompletionFormConfig',
  },
  {
    linkTo: '/TaskComments',
    linkText: 'Task comments',
    Icon: <CommentsIcon />,
    configLinkTo: '/TaskCommentsConfig',
  },
];

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
        {menuItems.map(({ linkTo, Icon, linkText, configLinkTo }) => (
          <div className={classes.item} key={linkTo}>
            <ListItem button component={Link} to={linkTo} onClick={() => setOpen(false)}>
              {Icon}
              <ListItemText primary={linkText} />
            </ListItem>
            <IconButton
              className={classes.iconButton}
              size="small"
              component={Link}
              to={configLinkTo}
              onClick={() => setOpen(false)}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
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
