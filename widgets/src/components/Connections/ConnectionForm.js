import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, Grid } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  title: {
    paddingBottom: 20,
  },
  footer: {
    paddingTop: 10,
    textAlign: 'right',
  },
};

const fields = [
  {
    key: 'name',
    label: 'Name',
    size: 3,
  },
  {
    key: 'engine',
    label: 'Engine',
    size: 3,
  },
  {
    key: 'url',
    label: 'Connection URL',
    size: 6,
  },
  {
    key: 'username',
    label: 'Username',
    size: 3,
  },
  {
    key: 'password',
    label: 'Password',
    size: 3,
  },
  {
    key: 'connectionTimeout',
    label: 'Timeout',
    size: 3,
  },
];

const ConnectionForm = ({ classes, onChange, onCancel, onSave, form }) => {
  return (
    <div>
      <Typography className={classes.title} variant="h4">
        Create new connection
      </Typography>
      <div>
        <Grid container spacing={3}>
          {fields.map(field => (
            <Grid key={field.key} item xs={field.size}>
              <TextField
                id={field.key}
                label={field.label}
                onChange={onChange(field.key)}
                value={form[field.key]}
                type={field.key === 'password' ? field.key : 'text'}
                disabled={field.key === 'name' && form.edit}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <div className={classes.footer}>
        <Button variant="contained" disableElevation onClick={onCancel}>
          Cancel
        </Button>{' '}
        <Button color="primary" variant="contained" disableElevation onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

ConnectionForm.propTypes = {
  classes: PropTypes.shape({
    footer: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    engine: PropTypes.string,
    url: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    connectionTimeout: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    edit: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default withStyles(styles)(ConnectionForm);
