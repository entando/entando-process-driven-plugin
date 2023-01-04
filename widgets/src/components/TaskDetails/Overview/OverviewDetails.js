import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import moment from 'moment';

import BadgeChip from '../../common/BadgeChip';

const getColorByDate = date => {
  const today = moment();
  const momentDate = moment(date);
  if (today.diff(momentDate, 'hours') <= 24) {
    return 'success';
  }
  if (today.diff(momentDate, 'days') <= 7) {
    return 'warning';
  }
  return 'error';
};

const parseDate = value => (value ? new Date(value).toLocaleString(i18next.language || 'en') : '-');

const displayedDetails = [
  {
    label: 'task.fields.createdBy',
    value: 'createdBy',
  },
  {
    label: 'task.fields.name',
    value: 'name',
  },
  {
    label: 'task.fields.createdOn',
    value: 'createdAt',
    parse: parseDate,
  },
  {
    label: 'task.fields.status',
    value: 'status',
    render: (label, value) => <BadgeChip label={label} value={value} />,
  },
  {
    label: 'task.fields.due',
    value: 'expirationTime',
    parse: parseDate,
  },
];

const styles = {
  root: {
    marginTop: -18,
  },
  value: {
    marginTop: '20px',
  },
};

const OverviewDetails = ({ task, classes }) => {
  const { createdAt } = task;

  return (
    <Grid container spacing={8} className={classes.root}>
      {displayedDetails.map(detail => {
        const value =
          typeof detail.parse === 'function'
            ? detail.parse(task[detail.value])
            : task[detail.value];

        const hasCustomRender = typeof detail.render === 'function';

        return (
          <Grid item key={detail.label}>
            <FormLabel>{i18next.t(detail.label)}</FormLabel>
            <div className={classes.value}>
              {hasCustomRender && detail.render(value, getColorByDate(createdAt))}
              {!hasCustomRender && <Typography variant="body1">{value}</Typography>}
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
};

OverviewDetails.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  task: PropTypes.shape({
    createdAt: PropTypes.string,
    createdBy: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
    expirationTime: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(OverviewDetails);
