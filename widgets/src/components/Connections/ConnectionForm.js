import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Typography, Grid } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  footer: {
    paddingTop: 10,
    textAlign: 'right',
  },
};

const fields = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'engine',
    label: 'Engine',
  },
  {
    key: 'schema',
    label: 'Schema',
  },
  {
    key: 'host',
    label: 'Host',
  },
  {
    key: 'app',
    label: 'App',
  },
  {
    key: 'username',
    label: 'Username',
  },
  {
    key: 'password',
    label: 'Password',
  },
];

const ConnectionForm = ({ classes, onChange, onCancel, onSave, form }) => {
  return (
    <div>
      <Typography variant="h6">Create new connection</Typography>
      <div>
        <Grid container spacing={3}>
          {fields.map(field => (
            <Grid key={field.key} item xs={3}>
              <TextField
                id={field.key}
                label={field.label}
                onChange={onChange(field.key)}
                value={form[field.key]}
                type={field.key === 'password' ? field.key : 'text'}
                disabled={field.key === 'name' && form.edit}
                fullWidth
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
  }).isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    engine: PropTypes.string,
    schema: PropTypes.string,
    host: PropTypes.string,
    app: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    edit: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default withStyles(styles)(ConnectionForm);
