import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  success: {
    backgroundColor: theme.palette.success.dark,
  },
  warning: {
    backgroundColor: theme.palette.warning.dark,
  },
});

const IconByType = ({ type, className }) => {
  switch (type) {
    case 'error':
      return <ErrorIcon className={className} />;

    case 'success':
      return <CheckCircleIcon className={className} />;

    default:
      return <WarningIcon className={className} />;
  }
};

IconByType.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

const Notification = ({ classes, message, type, onClose }) => {
  const messageTemplate = (
    <span className={classes.message}>
      <IconByType type={type} className={clsx(classes.icon, classes.iconVariant)} />
      {message}
    </span>
  );

  return message ? (
    <Snackbar open onClose={onClose}>
      <SnackbarContent
        className={classes[type]}
        message={messageTemplate}
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  ) : (
    ''
  );
};

Notification.propTypes = {
  classes: PropTypes.shape({
    message: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    iconVariant: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
  message: PropTypes.string,
  type: PropTypes.string,
  onClose: PropTypes.func,
};

Notification.defaultProps = {
  message: null,
  type: 'warning',
  onClose: () => {},
};

export default withStyles(styles, { withTheme: true })(Notification);
