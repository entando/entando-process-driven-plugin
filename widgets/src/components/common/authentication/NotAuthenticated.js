import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import i18next from 'i18next';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

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

const NotAuthenticated = ({ classes }) => {
  return (
    <Container disableGutters className={classes.wrapper}>
      <Typography>{i18next.t('authentication.notAuthenticated')}</Typography>
    </Container>
  );
};

NotAuthenticated.propTypes = {
  classes: PropTypes.shape({
    wrapper: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(NotAuthenticated);
