import React from 'react';
import PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 200,
  },
  input: {
    flex: 1,
  },
};

const SearchInput = ({ classes, onChange, value }) => (
  <div className={classes.root}>
    <InputBase
      className={classes.input}
      placeholder="Search..."
      value={value}
      onChange={onChange}
    />
    <SearchIcon />
  </div>
);

SearchInput.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    input: PropTypes.string,
    iconButton: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

SearchInput.defaultProps = {
  classes: {},
  value: '',
};

export default withStyles(styles)(SearchInput);
