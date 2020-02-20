import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Login from '@material-ui/icons/ExitToApp';

const styles = {
  icon: {
    color: '#757575',
  },
};

const LoggedOut = ({ classes, onClickLogin }) => {
  return (
    <IconButton size="small" aria-label="login" onClick={onClickLogin}>
      <Login className={classes.icon} />
    </IconButton>
  );
};

LoggedOut.propTypes = {
  classes: PropTypes.shape({
    icon: PropTypes.string,
  }).isRequired,
  onClickLogin: PropTypes.func.isRequired,
};

export default withStyles(styles)(LoggedOut);
