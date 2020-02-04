import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Box, withStyles } from '@material-ui/core';

import { UpTrend, DownTrend } from 'components/common/Icons';

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

const DataSummary = ({ value, label, percent, trend }) => (
  <Grid container>
    <Grid item xs={12}>
      <Typography variant="h6">{value}</Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="caption">{label}</Typography>
    </Grid>
    <Grid item xs={2} style={{ textAlign: 'right' }}>
      <Typography variant="subtitle1">{percent}%</Typography>
    </Grid>
    <Grid item xs={2} style={{ textAlign: 'right' }}>
      <TrendIconWrapper trend={trend} />
    </Grid>
    <Grid item xs={12}>
      <Box my={1}>
        <PercentBar value={percent} barColor={trend === 'up' ? UP_COLOR : DOWN_COLOR} />
      </Box>
    </Grid>
  </Grid>
);

DataSummary.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  trend: PropTypes.oneOf(['up', 'down']).isRequired,
};

export default DataSummary;
