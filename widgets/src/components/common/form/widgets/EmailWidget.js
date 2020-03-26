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

const EmailWidget = props => {
  const classes = useStyles();

  const {
    id,
    required,
    disabled,
    readonly,
    value,
    onChange,
    onBlur,
    onFocus,
    options,
    label,
    schema,
    error,
  } = props;

  const handleOnChange = event => onChange(value === '' ? options.emptyValue : event.target.value);
  const handleOnBlur = event => onBlur(event.target.value);
  const handleOnFocus = event => onFocus(event.target.value);

  return (
    <FormControl required={required} className={classes.formControl}>
      <TextField
        id={id}
        label={label || schema.title}
        type="email"
        error={error}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        disabled={disabled || readonly}
      />
    </FormControl>
  );
};

EmailWidget.propTypes = {
  id: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  readonly: PropTypes.bool,
  label: PropTypes.string,
  options: PropTypes.shape({
    emptyValue: PropTypes.string,
  }),
  schema: PropTypes.shape({
    title: PropTypes.string,
  }),
};

EmailWidget.defaultProps = {
  id: '',
  required: false,
  error: false,
  value: '',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
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

export default EmailWidget;
