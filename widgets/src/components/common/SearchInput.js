import React from 'react';
import PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import withStyles from '@material-ui/styles/withStyles';

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 200,
    borderBottom: 'solid 1px #ccc',
  },
  input: {
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
};

const SearchInput = ({ classes }) => (
  <div className={classes.root}>
    <InputBase className={classes.input} placeholder="Search..." />
    <IconButton className={classes.iconButton} aria-label="search">
      <SearchIcon />
    </IconButton>
  </div>
);

SearchInput.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    input: PropTypes.string,
    iconButton: PropTypes.string,
  }),
};

SearchInput.defaultProps = {
  classes: {},
};

export default withStyles(styles)(SearchInput);
