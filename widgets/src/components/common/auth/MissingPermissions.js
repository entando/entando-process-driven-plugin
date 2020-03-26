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

const MissingPermissions = ({ classes, missingPermissions }) => {
  return (
    <Container disableGutters className={classes.wrapper}>
      <Typography>
        {i18next.t('authentication.missingPermissions')}: {missingPermissions.join(', ')}.
      </Typography>
    </Container>
  );
};

MissingPermissions.propTypes = {
  classes: PropTypes.shape({
    wrapper: PropTypes.string,
  }).isRequired,
  missingPermissions: PropTypes.arrayOf(PropTypes.string),
};

MissingPermissions.defaultProps = {
  missingPermissions: [],
};

export default withStyles(styles)(MissingPermissions);
