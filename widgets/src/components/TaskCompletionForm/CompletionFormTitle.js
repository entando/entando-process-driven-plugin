import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = {
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  divider: {
    marginTop: '20px',
    marginBottom: '10px',
  },
};

const CompletionFormTitle = ({ classes, title }) => (
  <div>
    <Typography variant="h3">{i18next.t(title)}</Typography>
    <Divider className={classes.divider} />
  </div>
);

CompletionFormTitle.propTypes = {
  classes: PropTypes.shape({
    divider: PropTypes.string,
  }).isRequired,
  title: PropTypes.string,
};

CompletionFormTitle.defaultProps = {
  title: '',
};

export default withStyles(styles)(CompletionFormTitle);
