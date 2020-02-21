import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';

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
    render: value => <badge-chip badge-label={value} badge-value={value} />,
  },
  {
    label: 'task.fields.due',
    value: 'expirationTime',
    parse: parseDate,
  },
];

const styles = {
  value: {
    marginTop: '20px',
  },
};

const OverviewDetails = ({ task, classes }) => {
  return (
    <Grid container spacing={8}>
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
              {hasCustomRender && detail.render(value)}
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
    value: PropTypes.string,
  }).isRequired,
  task: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(OverviewDetails);
