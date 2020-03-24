import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  container: props => ({
    padding: props.hidden ? '0px 0px' : '0px 15px',
  }),
  label: {
    marginTop: '5px',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '15px',
    color: '#676A6C',
  },
  disabled: {
    cursor: 'not-allowed',
  },
  disabledLabel: {
    color: '#BBBBBB',
    cursor: 'not-allowed',
  },
  error: {
    color: '#f44336',
  },
});

const FieldTemplate = props => {
  const classes = useStyles(props);

  const {
    id,
    label,
    required,
    displayLabel,
    children,
    disabled,
    uiSchema,
    errors: {
      props: { errors },
    },
    hidden,
  } = props;

  const options = (uiSchema && uiSchema['ui:options']) || {};

  const showLabel = displayLabel && !hidden;

  return (
    <div className={classNames(classes.container, disabled && classes.disabled)}>
      {showLabel && (
        <label
          htmlFor={id}
          className={classNames(
            classes.label,
            disabled && classes.disabledLabel,
            errors && classes.error
          )}
        >
          {label}
          {required ? ' *' : null}
        </label>
      )}
      {options.innerSize ? (
        <Grid container spacing={3} className={classes.gridContainer}>
          <Grid item xs={options.innerSize}>
            {children}
          </Grid>
        </Grid>
      ) : (
        <div className={classes.field}>{children}</div>
      )}
    </div>
  );
};

// All available props
// https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#field-template
FieldTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  displayLabel: PropTypes.bool,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  uiSchema: PropTypes.shape().isRequired,
  errors: PropTypes.shape().isRequired,
};

FieldTemplate.defaultProps = {
  displayLabel: true,
  disabled: false,
  hidden: false,
  required: false,
  label: '',
};

export default FieldTemplate;
