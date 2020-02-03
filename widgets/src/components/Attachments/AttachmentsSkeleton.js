import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const styles = {
  listItem: {
    border: 'solid 1px #eee',
    marginBottom: 2,
    background: 'white',
    borderRadius: 3,
    height: 52,
  },
};

const getKey = (qty, i) => qty - i;

const AttachmentsSkeleton = ({ classes, rows }) => (
  <div>
    <List>
      {[...Array(rows)].map((row, i) => (
        <ListItem key={getKey(rows, i)} className={classes.listItem}>
          <ListItemIcon>
            <Skeleton variant="circle" width={20} height={20} />
          </ListItemIcon>
          <ListItemText>
            <Skeleton width="80%" />
          </ListItemText>
          <ListItemSecondaryAction>
            <Skeleton variant="circle" width={20} height={20} />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </div>
);

AttachmentsSkeleton.propTypes = {
  classes: PropTypes.shape({
    listItem: PropTypes.string,
  }),
  rows: PropTypes.number,
};

AttachmentsSkeleton.defaultProps = {
  classes: {},
  rows: 10,
};

export default withStyles(styles)(AttachmentsSkeleton);
