import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    padding: '0px 5px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '15px',
    color: '#676A6C',
  },
});

const FieldTemplate = ({ id, label, required, displayLabel, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {displayLabel && (
        <label htmlFor={id} className={classes.label}>
          {label}
          {required ? '*' : null}
        </label>
      )}
      <div>{children}</div>
    </div>
  );
};

// All available props
// https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#field-template
FieldTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  displayLabel: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

FieldTemplate.defaultProps = {
  displayLabel: true,
  required: false,
};

export default FieldTemplate;
