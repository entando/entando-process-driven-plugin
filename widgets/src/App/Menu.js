import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import {
  Attachment as AttachmentIcon,
  Home as HomeIcon,
  ViewQuilt as ViewQuiltIcon,
  List as ListIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  DoneAll as DoneAllIcon,
  Comment as CommentsIcon,
  CloudQueue as CloudQueueIcon,
  DeveloperBoard as DeveloperBoardIcon,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  item: {
    position: 'relative',
  },
  listItem: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  iconButton: {
    position: 'absolute',
    right: 5,
    top: 12,
  },
};

const menuItems = [
  {
    linkTo: '/Connections',
    linkText: 'Connections',
    Icon: <CloudQueueIcon />,
  },
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
  {
    linkTo: '/SummaryCard',
    linkText: 'Summary card',
    Icon: <DashboardIcon />,
    configLinkTo: '/SummaryCardConfig',
  },
  {
    linkTo: '/ProcessForm',
    linkText: 'Process form',
    Icon: <DescriptionIcon />,
    configLinkTo: '/ProcessFormConfig',
  },
  {
    linkTo: '/ProcessDefinition',
    linkText: 'Process Definition',
    Icon: <DeveloperBoardIcon />,
    configLinkTo: 'ProcessDefinitionConfig',
  },
  {
    linkTo: '/OvertimeGraph',
    linkText: 'Overtime graph',
    Icon: <BarChartIcon />,
    configLinkTo: '/OvertimeGraphConfig',
  },
  {
    linkTo: '/Attachments',
    linkText: 'Attachments',
    Icon: <AttachmentIcon />,
    configLinkTo: '/AttachmentsConfig',
  },
  {
    linkTo: '/ProcessList',
    linkText: 'Process List',
    Icon: <ListIcon />,
    configLinkTo: '/ProcessListConfig',
  },
];

const Menu = ({ open, setOpen, classes }) => (
  <Drawer open={open} onClose={() => setOpen(false)}>
    <div className="app-list">
      <List>
        <ListItem button component={Link} to="/" onClick={() => setOpen(false)}>
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem button component={Link} to="/task-details-page/" onClick={() => setOpen(false)}>
          <ListItemIcon>
            <ViewQuiltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Task Details page" />
        </ListItem>

        <ListItem button component={Link} to="/smart-inbox-page/" onClick={() => setOpen(false)}>
          <ListItemIcon>
            <ViewQuiltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Smart Inbox page" />
        </ListItem>

        <Typography variant="overline">Widgets</Typography>
        <Divider />
        {menuItems.map(({ linkTo, Icon, linkText, configLinkTo }) => (
          <div className={classes.item} key={linkTo}>
            <ListItem
              className={classes.listItem}
              button
              component={Link}
              to={linkTo}
              onClick={() => setOpen(false)}
            >
              {Icon}
              <ListItemText style={{ marginLeft: 5 }} primary={linkText} />
            </ListItem>
            {configLinkTo && (
              <IconButton
                className={classes.iconButton}
                size="small"
                component={Link}
                to={configLinkTo}
                onClick={() => setOpen(false)}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        ))}
      </List>
    </div>
  </Drawer>
);

Menu.propTypes = {
  classes: PropTypes.shape({
    item: PropTypes.string,
    listItem: PropTypes.string,
    iconButton: PropTypes.string,
  }),
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

Menu.defaultProps = {
  classes: {},
  open: false,
  setOpen: () => {},
};

export default withStyles(styles)(Menu);
