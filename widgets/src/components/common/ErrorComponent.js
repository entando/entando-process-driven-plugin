import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import GridOffIcon from '@material-ui/icons/GridOff';
import ReportIcon from '@material-ui/icons/Report';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

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

const ErrorComponent = ({ classes, message }) => {
  const getIconDisplay = msg => {
    switch (msg) {
      case 'taskList.emptyList':
        return GridOffIcon;
      case 'messages.errors.errorResponse':
        return ReportIcon;
      default:
        return CloudOffIcon;
    }
  };

  const Represent = getIconDisplay(message);

  return (
    <div className={classes.root}>
      <Represent className={classes.icon} />
      <Typography>{i18next.t(message)}</Typography>
    </div>
  );
};

ErrorComponent.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  message: PropTypes.string.isRequired,
};

export default withStyles(styles)(ErrorComponent);
