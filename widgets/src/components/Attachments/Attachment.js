import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  listItem: {
    border: 'solid 1px #eee',
    marginBottom: 2,
    background: 'white',
    borderRadius: 3,
  },
  truncate: {
    display: 'block',
    overflow: 'hidden',
    width: '80%',
    textOverflow: 'ellipsis',
  },
};

const Attachment = ({ classes, item, onDelete }) => (
  <ListItem className={classes.listItem}>
    <ListItemIcon>
      <FileCopyIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText className={classes.truncate}>{item.name}</ListItemText>
    <ListItemSecondaryAction>
      <IconButton size="small" onClick={onDelete(item)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

Attachment.propTypes = {
  classes: PropTypes.shape({
    listItem: PropTypes.string,
    truncate: PropTypes.string,
  }),
  item: PropTypes.shape({
    name: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
};

Attachment.defaultProps = {
  classes: {},
  item: {},
};

export default withStyles(styles)(Attachment);
