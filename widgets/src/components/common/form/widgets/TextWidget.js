import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  formControl: {
    width: '100%',
  },
  root: {
    padding: '2px',
    '& $notchedOutline': {
      borderRadius: '0px',
    },
    '&:hover $notchedOutline': {
      borderWidth: 1,
    },
  },
  input: {
    padding: '7px 5px',
  },
  notchedOutline: {},
});

const TextWidget = props => {
  const classes = useStyles();

  const { id, required, disabled, value, onChange, onBlur, onFocus, autofocus, options } = props;

  const muiProps = options.muiProps || {};

  const handleOnChange = event => onChange(value === '' ? options.emptyValue : event.target.value);
  const handleOnBlur = event => onBlur(id, event.target.value);
  const handleOnFocus = event => onFocus(id, event.target.value);

  return (
    <FormControl required={required} disabled={disabled} className={classes.formControl}>
      <OutlinedInput
        classes={{
          root: classes.root,
          input: classes.input,
          notchedOutline: classes.notchedOutline,
        }}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        autoFocus={autofocus}
        {...muiProps} // eslint-disable-line react/jsx-props-no-spreading
      />
    </FormControl>
  );
};

TextWidget.propTypes = {
  id: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  readonly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  autofocus: PropTypes.bool.isRequired,
  options: PropTypes.shape({
    emptyValue: PropTypes.string,
    muiProps: PropTypes.shape({
      color: PropTypes.oneOf(['primary', 'secondary']), // MUI default: primary
      fullWidth: PropTypes.bool, // MUI default: false
      margin: PropTypes.oneOf(['none', 'dense', 'normal']),
      multiline: PropTypes.bool, // MUI default: false
      rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rowsMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      size: PropTypes.oneOf(['small', 'medium']),
      variant: PropTypes.oneOf(['standard', 'outlined', 'filled', 'entando']), // MUI default: standard
    }),
  }),
  schema: PropTypes.shape({
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

TextWidget.defaultProps = {
  value: '',
  options: {},
  schema: {},
};

export default TextWidget;
