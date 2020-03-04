import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Logout from '@material-ui/icons/MeetingRoom';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '19px',
    color: '#757575',
    marginLeft: '10px',
  },
  avatar: {
    width: '30px',
    height: '30px',
    backgroundColor: '#757575',
  },
  username: {
    margin: '0px 5px',
  },
  icon: {
    color: '#757575',
  },
};

const LoggedIn = ({ classes, user, onClickLogout }) => {
  return (
    <div className={classes.container}>
      <Avatar className={classes.avatar}>{user.username.charAt(0)}</Avatar>
      <span className={classes.username}>{user.username}</span>
      <IconButton size="small" aria-label="logout" onClick={onClickLogout}>
        <Logout className={classes.icon} />
      </IconButton>
    </div>
  );
};

LoggedIn.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    avatar: PropTypes.string,
    username: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
  }).isRequired,
  onClickLogout: PropTypes.func.isRequired,
};

export default withStyles(styles)(LoggedIn);
