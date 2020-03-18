import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  formControl: {
    width: '100%',
  },
});

const DateWidget = props => {
  const classes = useStyles();

  const {
    id,
    required,
    disabled,
    readonly,
    value,
    onChange,
    options,
    label,
    schema,
    error,
  } = props;

  const handleOnChange = event => onChange(value === '' ? options.emptyValue : event.target.value);

  return (
    <FormControl required={required} className={classes.formControl}>
      <TextField
        id={id}
        label={label || schema.title}
        type="date"
        error={error}
        value={value}
        onChange={handleOnChange}
        disabled={disabled || readonly}
      />
    </FormControl>
  );
};

DateWidget.propTypes = {
  id: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  label: PropTypes.string,
  options: PropTypes.shape({
    emptyValue: PropTypes.string,
  }),
  schema: PropTypes.shape({
    title: PropTypes.string,
  }),
};

DateWidget.defaultProps = {
  id: '',
  required: false,
  error: false,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: false,
  readonly: false,
  label: '',
  options: {
    emptyValue: '',
  },
  schema: {
    title: '',
  },
};

export default DateWidget;
