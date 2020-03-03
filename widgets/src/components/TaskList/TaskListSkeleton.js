import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  tableRows: {
    margin: '40px auto 40px auto',
  },
};

const getKey = (qty, i) => qty - i;

const TaskListSkeleton = ({ classes, rows }) => (
  <>
    <div>
      <Skeleton width="100%" height={40} variant="rect" />
      {[...Array(rows)].map((row, i) => (
        <Skeleton key={getKey(rows, i)} className={classes.tableRows} width="98%" height={10} />
      ))}
    </div>
    <div>
      <Skeleton width="100%" height={50} variant="rect" />
    </div>
  </>
);

TaskListSkeleton.propTypes = {
  classes: PropTypes.shape({
    tableRows: PropTypes.string,
  }),
  rows: PropTypes.number,
};

TaskListSkeleton.defaultProps = {
  classes: {},
  rows: 10,
};

export default withStyles(styles)(TaskListSkeleton);
