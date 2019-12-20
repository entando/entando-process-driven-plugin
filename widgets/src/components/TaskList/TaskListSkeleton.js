import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    '&>div': {
      width: '50%',
    },
  },
  search: {
    width: '20% !important',
    marginTop: 20,
  },
  tableRows: {
    margin: '40px auto 40px auto',
  },
};

const getKey = (qty, i) => qty - i;

const TaskListSkeleton = ({ classes, rows }) => (
  <>
    <div className={classes.header}>
      <div>
        <Skeleton width="40%" />
        <Skeleton width="20%" />
      </div>
      <div className={classes.search}>
        <Skeleton width="100%" height={40} variant="rect" />
      </div>
    </div>
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
    header: PropTypes.string,
    search: PropTypes.string,
    tableRows: PropTypes.string,
  }),
  rows: PropTypes.number,
};

TaskListSkeleton.defaultProps = {
  classes: {},
  rows: 10,
};

export default withStyles(styles)(TaskListSkeleton);
