import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles({
  formControl: {
    width: '100%',
  },
});

const DateWidget = props => {
  const classes = useStyles();

  const { id, required, disabled, readonly, value, onChange, options, label, schema } = props;

  const handleOnChange = dateTime => {
    onChange(dateTime ? dateTime.toString() : options.emptyValue || null);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <FormControl required={required} className={classes.formControl}>
        <DatePicker
          id={id}
          label={label || schema.title}
          inputVariant="outlined"
          format={options.format || 'YYYY-MM-DD'}
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

DateWidget.propTypes = {
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
  }),
  schema: PropTypes.shape({
    title: PropTypes.string,
  }),
};

DateWidget.defaultProps = {
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

export default DateWidget;
