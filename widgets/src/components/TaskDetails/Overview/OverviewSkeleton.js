import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  value: {
    marginTop: '20px',
  },
};

const TaskListSkeleton = ({ classes }) => (
  <>
    <div className={classes.header}>
      <Skeleton width="200px" height={33} variant="rect" />
      <Skeleton width="230px" height={40} variant="rect" />
    </div>
    <div>
      <Grid container spacing={8}>
        <Grid item>
          <Skeleton width="80px" variant="rect" />
          <div className={classes.value}>
            <Skeleton width="60px" variant="rect" />
          </div>
        </Grid>
        <Grid item>
          <Skeleton width="80px" variant="rect" />
          <div className={classes.value}>
            <Skeleton width="100px" variant="rect" />
          </div>
        </Grid>
        <Grid item>
          <Skeleton width="80px" variant="rect" />
          <div className={classes.value}>
            <Skeleton width="120px" variant="rect" />
          </div>
        </Grid>
        <Grid item>
          <Skeleton width="80px" variant="rect" />
          <div className={classes.value}>
            <Skeleton width="100px" height={32} variant="rect" />
          </div>
        </Grid>
        <Grid item>
          <Skeleton width="80px" variant="rect" />
          <div className={classes.value}>
            <Skeleton width="100px" variant="rect" />
          </div>
        </Grid>
      </Grid>
    </div>
  </>
);

TaskListSkeleton.propTypes = {
  classes: PropTypes.shape({
    header: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(TaskListSkeleton);
