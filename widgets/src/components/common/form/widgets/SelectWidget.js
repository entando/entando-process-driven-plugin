import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// refer to Material UI on custom select styling https://material-ui.com/components/selects/#customized-selects
const StyledInputBase = withStyles({
  input: {
    borderRadius: 0,
    border: '1px solid rgba(0, 0, 0, 0.23)',
    height: '18px',
  },
})(InputBase);

const useStyles = makeStyles({
  formControl: {
    width: '100%',
  },
});

const SelectWidget = props => {
  const classes = useStyles();

  const {
    id,
    multiple,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    options,
  } = props;

  console.log('SelectWidget', props, options);

  const { enumDisabled, enumOptions } = options;
  const emptyValue = multiple ? [] : '';

  const handleOnChange = event => onChange(id, event.target.value);
  const handleOnBlur = event => onBlur(id, event.target.value);
  const handleOnFocus = event => onFocus(id, event.target.value);

  return (
    <FormControl required={required} className={classes.formControl}>
      <Select
        value={typeof value === 'undefined' ? emptyValue : value}
        variant="outlined"
        input={<StyledInputBase />}
        required={required}
        multiple={multiple}
        disabled={disabled || readonly}
        autoFocus={autofocus}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
      >
        {enumOptions.map(option => {
          const optionDisabled = enumDisabled && enumDisabled.indexOf(option.value) > -1;

          return (
            <MenuItem key={option.value} value={option.value} disabled={optionDisabled}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

SelectWidget.propTypes = {
  id: PropTypes.string.isRequired,
  options: PropTypes.shape({
    enumDisabled: PropTypes.bool,
    enumOptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
      })
    ),
  }).isRequired,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  autofocus: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

SelectWidget.defaultProps = {
  required: false,
  multiple: false,
  disabled: false,
  readonly: false,
  autofocus: false,
  value: '',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
};

export default SelectWidget;
