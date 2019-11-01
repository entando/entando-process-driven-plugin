import React from 'react';
import PropTypes from 'prop-types';
import CloudOff from '@material-ui/icons/CloudOff';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';

const styles = {
  root: {
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  icon: {
    fontSize: 72,
    paddingBottom: 10,
  },
};

const ErrorComponent = ({ classes, message }) => (
  <div className={classes.root}>
    <CloudOff className={classes.icon} />
    <Typography>{message}</Typography>
  </div>
);

ErrorComponent.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    icon: PropTypes.string,
  }),
  message: PropTypes.string,
};

ErrorComponent.defaultProps = {
  classes: {},
  message: '',
};

export default withStyles(styles)(ErrorComponent);
