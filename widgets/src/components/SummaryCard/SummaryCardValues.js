import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { UpTrend as UpTrendIcon, DownTrend as DownTrendIcon } from '../common/Icons';

const styles = {
  root: {
    display: 'flex',
    padding: '20px 25px',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    '&.downTrend $trendValue': {
      color: '#ED5565',
    },
    '&.upTrend $trendValue': {
      color: '#23C6C8',
    },
  },
  totalLabel: {
    marginTop: 15,
  },
  trendValue: {
    fontWeight: 'bold',
  },
  valueIcon: {
    width: 13,
    height: 13,
  },
};

const SummaryCardValues = ({ dataType, values, classes, loading }) => {
  const generateSkeleton = () => (
    <>
      <div>
        <Skeleton width="110px" height={37} variant="rect" />
        <Skeleton width="90px" height={14} variant="rect" className={classes.totalLabel} />
      </div>
      <div>
        <Skeleton width="50px" height={16} variant="rect" />
      </div>
    </>
  );

  const trendNotation = trend => {
    switch (trend) {
      case 'up':
        return <UpTrendIcon className={classes.valueIcon} />;
      case 'down':
        return <DownTrendIcon className={classes.valueIcon} />;
      default:
        return null;
    }
  };

  const percVal = values && 'percentage' in values ? Math.round(values.percentage * 100) : null;
  const percent = !Number.isNaN(percVal) ? `${percVal < 0 ? 0 - percVal : percVal}%` : '-';

  const trend = percVal === 0 ? '' : percVal >= 0 ? 'up' : 'down';

  return (
    <div className={classNames(classes.root, `${trend}Trend`)}>
      {loading && generateSkeleton()}
      {!loading && values && (
        <>
          <div>
            <Typography variant="h1">
              {i18next.t(`summary.labels.${dataType}.value`, { value: values.value })}
            </Typography>
            <Typography variant="caption">
              {i18next.t(`summary.labels.${dataType}.total_label`)}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" component="span" className={classes.trendValue}>
              {percent} {trendNotation(trend)}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
};

SummaryCardValues.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    totalLabel: PropTypes.string,
    trendValue: PropTypes.string,
    valueIcon: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool,
  dataType: PropTypes.string.isRequired,
  values: PropTypes.shape({
    value: PropTypes.number,
    percentage: PropTypes.number,
  }),
};

SummaryCardValues.defaultProps = {
  loading: false,
  values: {},
};

export default withStyles(styles)(SummaryCardValues);
