import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Box, withStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import { UpTrend, DownTrend } from '../common/Icons';

const PercentBar = ({ value, barColor }) => (
  <div
    style={{ height: '6px', borderRadius: '4px', backgroundColor: '#F5F5F5', overflow: 'hidden' }}
  >
    <div style={{ height: '100%', width: `${value}%`, backgroundColor: barColor }} />
  </div>
);

const UP_COLOR = '#1AB394';
const DOWN_COLOR = '#ED5565';

const TrendIconWrapper = withStyles({
  root: {
    '&.downTrend': {
      color: DOWN_COLOR,
    },
    '&.upTrend': {
      color: UP_COLOR,
    },
  },
  icon: {
    width: 13,
    height: 13,
  },
})(({ classes, trend }) => {
  if (trend === 'none') return null;
  const Icon = trend === 'up' ? UpTrend : DownTrend;
  return (
    <span className={`${classes.root} ${trend}Trend`}>
      <Icon className={classes.icon} />
    </span>
  );
});

PercentBar.propTypes = {
  value: PropTypes.number.isRequired,
  barColor: PropTypes.string.isRequired,
};

const styles = {
  value: {
    fontSize: 24,
  },
  percent: {
    fontSize: 13,
    fontWeight: 'bold',
  },
};

const DataSummary = ({ classes, value, label, percent, trend, loading }) => (
  <Grid container>
    <Grid item xs={12}>
      {loading ? (
        <Skeleton width={100} />
      ) : (
        <Typography variant="h6" className={classes.value}>
          {value}
        </Typography>
      )}
    </Grid>
    <Grid item xs={9}>
      {loading ? <Skeleton width={150} /> : <Typography variant="caption">{label}</Typography>}
    </Grid>
    <Grid item xs={2} style={{ textAlign: 'right' }}>
      {loading ? (
        <Skeleton width={50} />
      ) : (
        <Typography variant="subtitle1" className={classes.percent}>
          {percent}%
        </Typography>
      )}
    </Grid>
    <Grid item xs={1} style={{ textAlign: 'right' }}>
      {loading ? <Skeleton width={40} /> : <TrendIconWrapper trend={trend} />}
    </Grid>
    <Grid item xs={12}>
      <Box my={1}>
        {loading ? (
          <Skeleton />
        ) : (
          <PercentBar
            value={percent}
            barColor={trend === 'up' ? UP_COLOR : trend === 'down' ? DOWN_COLOR : ''}
          />
        )}
      </Box>
    </Grid>
  </Grid>
);

DataSummary.propTypes = {
  classes: PropTypes.shape({
    value: PropTypes.string,
    percent: PropTypes.string,
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  label: PropTypes.string.isRequired,
  percent: PropTypes.number,
  trend: PropTypes.oneOf(['up', 'down', 'none']),
  loading: PropTypes.bool,
};

DataSummary.defaultProps = {
  loading: false,
  trend: 'none',
  percent: 0,
  value: '',
};

export default withStyles(styles)(DataSummary);
