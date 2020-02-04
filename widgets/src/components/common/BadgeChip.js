import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';

const styles = {
  root: {
    backgroundColor: '#1AB394',
    borderRadius: '5px',
    fontWeight: 700,
    fontSize: '11px',
    lineHeight: '13px',
    color: '#FFFEFE',
  },
};

const BadgeChip = ({ label, classes }) => {
  return <Chip className={classes.root} label={label} />;
};

BadgeChip.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
  }).isRequired,
  /** label to render inside component */
  label: PropTypes.string,
};

BadgeChip.defaultProps = {
  label: '',
};

export default withStyles(styles)(BadgeChip);
