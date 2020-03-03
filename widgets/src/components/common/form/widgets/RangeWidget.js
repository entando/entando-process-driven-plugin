import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  formControl: {
    width: '100%',
  },
  root: {
    padding: '2px',
  },
});

const RangeWidget = props => {
  const classes = useStyles();

  const { id, required, disabled, value, onChange, onBlur, onFocus, autofocus, options } = props;

  const muiProps = options.muiProps || {};

  const handleOnChange = event => onChange(value === '' ? options.emptyValue : event.target.value);
  const handleOnBlur = event => onBlur(id, event.target.value);
  const handleOnFocus = event => onFocus(id, event.target.value);

  return (
    <FormControl required={required} disabled={disabled} className={classes.formControl}>
      <Slider
        classes={{
          root: classes.root,
        }}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        autoFocus={autofocus}
        valueLabelDisplay="auto"
        {...muiProps} // eslint-disable-line react/jsx-props-no-spreading
        min={-1}
        max={1000}
      />
    </FormControl>
  );
};

RangeWidget.propTypes = {
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
      color: PropTypes.oneOf(['primary', 'secondary']),
      component: PropTypes.elementType,
      marks: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
      ]),
      min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      orientation: PropTypes.oneOf(['horizontal', 'vertical']),
      scale: PropTypes.func,
      step: PropTypes.oneOf([null, PropTypes.number, PropTypes.string]),
      track: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['normal', 'inverted'])]),
    }),
  }),
  schema: PropTypes.shape({
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

RangeWidget.defaultProps = {
  value: '',
  options: {},
  schema: {},
};

export default RangeWidget;
