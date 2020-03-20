import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const ColorCircularProgress = withStyles({
  root: {
    color: '#9D9D9D',
  },
})(CircularProgress);

const styles = {
  wrapper: {
    padding: '20px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    minHeight: '100px',
    textAlign: 'center',
  },
};

const Loader = ({ classes }) => {
  return (
    <Container disableGutters className={classes.wrapper}>
      <ColorCircularProgress />
    </Container>
  );
};

Loader.propTypes = {
  classes: PropTypes.shape({
    wrapper: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(Loader);
