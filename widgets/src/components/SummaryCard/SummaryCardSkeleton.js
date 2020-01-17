import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Skeleton from '@material-ui/lab/Skeleton';
import Divider from '@material-ui/core/Divider';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  values: {
    paddingTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
};

const SummaryCardSkeleton = ({ classes }) => (
  <>
    <div className={classes.header}>
      <Skeleton width="100px" height={18} variant="rect" />
      <Skeleton width="90px" height={18} variant="rect" />
    </div>
    <Divider className={classes.divider} />
    <div className={classes.values}>
      <div>
        <Skeleton width="110px" height={37} variant="rect" />
        <Skeleton width="90px" height={14} variant="rect" />
      </div>
      <div>
      <Skeleton width="50px" height={16} variant="rect" />
      </div>
    </div>
  </>
);


SummaryCardSkeleton.propTypes = {
  classes: PropTypes.shape({
    header: PropTypes.string,
    values: PropTypes.string,
    leftvalue: PropTypes.string,
    rightvalue: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(SummaryCardSkeleton);
