import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles({
  formControl: {
    width: '100%',
  },
});

const DateTimeWidget = props => {
  const classes = useStyles();

  const { id, required, disabled, readonly, value, onChange, options, label, schema } = props;

  const handleOnChange = dateTime => {
    onChange(dateTime ? dateTime.toString() : options.emptyValue || null);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <FormControl required={required} className={classes.formControl}>
        <DateTimePicker
          id={id}
          label={label || schema.title}
          inputVariant="outlined"
          ampm={options.ampm || false}
          format={options.format || 'YYYY-MM-DD HH:mm'}
          InputProps={{ notched: false }}
          value={value}
          onChange={handleOnChange}
          disabled={disabled || readonly}
          clearable
        />
      </FormControl>
    </MuiPickersUtilsProvider>
  );
};

DateTimeWidget.propTypes = {
  id: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  label: PropTypes.string,
  options: PropTypes.shape({
    emptyValue: PropTypes.string,
    format: PropTypes.string,
    ampm: PropTypes.bool,
  }),
  schema: PropTypes.shape({
    title: PropTypes.string,
  }),
};

DateTimeWidget.defaultProps = {
  id: '',
  required: false,
  value: '',
  onChange: () => {},
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

export default DateTimeWidget;
