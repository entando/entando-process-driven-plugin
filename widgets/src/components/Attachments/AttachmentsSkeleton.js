import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  root: {
    padding: '8px 0',
  },
  item: {
    marginBottom: 3,
  },
};

const getKey = (qty, i) => qty - i;

const AttachmentsSkeleton = ({ classes, rows }) => (
  <div className={classes.root}>
    {[...Array(rows)].map((row, i) => (
      <Skeleton
        key={getKey(rows, i)}
        className={classes.item}
        width="100%"
        height={52}
        variant="rect"
      />
    ))}
  </div>
);

AttachmentsSkeleton.propTypes = {
  classes: PropTypes.shape({
    item: PropTypes.string,
    root: PropTypes.string,
  }),
  rows: PropTypes.number,
};

AttachmentsSkeleton.defaultProps = {
  classes: {},
  rows: 10,
};

export default withStyles(styles)(AttachmentsSkeleton);
