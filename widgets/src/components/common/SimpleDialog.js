import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

const SimpleDialog = ({ title, body, open, onClose, fullWidth, maxWidth }) => (
  <Dialog open={open} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{body}</DialogContent>
  </Dialog>
);

SimpleDialog.propTypes = {
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  body: PropTypes.any.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.string,
};

SimpleDialog.defaultProps = {
  fullWidth: false,
  maxWidth: 'md',
};

export default SimpleDialog;
