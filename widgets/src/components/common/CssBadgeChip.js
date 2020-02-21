import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles({
  root: {
    borderRadius: '5px',
    fontWeight: 700,
    fontSize: '11px',
    lineHeight: '13px',
  },
});

const CssBadgeChip = props => {
  const classes = useStyles(props);
  const { label, value } = props;

  return <Chip className={`${classes.root} badge-chip-${value}`} label={label} />;
};

CssBadgeChip.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
};

CssBadgeChip.defaultProps = {
  label: '',
  value: '',
};

export default CssBadgeChip;
