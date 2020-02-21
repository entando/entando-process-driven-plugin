import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Chip from '@material-ui/core/Chip';

const defaultValues = {
  success: {
    bgColor: '#1AB394',
  },
  fail: {
    bgColor: '#e14c38',
  },
  pending: {
    bgColor: '#faf0cb',
    color: '#000000',
  },
  defaults: {
    color: '#FFFEFE',
    bgColor: '#1AB394',
  },
};

const getStyles = props => {
  const { defaults } = defaultValues;

  if (props.color || props.bgColor) {
    return {
      ...defaults,
      ...(props.color ? { color: props.color } : {}),
      ...(props.bgColor ? { bgColor: props.bgColor } : {}),
    };
  }

  if (props.styles) {
    const styles = JSON.parse(props.styles);

    if (styles && styles[props.value]) {
      return styles[props.value];
    }
  }

  if (defaultValues[props.value]) {
    return defaultValues[props.value];
  }

  return defaults;
};

const useStyles = makeStyles({
  root: {
    backgroundColor: props => getStyles(props).bgColor,
    borderRadius: '5px',
    fontWeight: 700,
    fontSize: '11px',
    lineHeight: '13px',
    color: props => getStyles(props).color,
  },
});

const BadgeChip = props => {
  const classes = useStyles(props);
  const { label } = props;

  return <Chip className={classes.root} label={label} />;
};

BadgeChip.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  bgColor: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  color: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  styles: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};

BadgeChip.defaultProps = {
  label: '',
  value: '',
  bgColor: '',
  color: '',
  styles: '',
};

export default BadgeChip;
