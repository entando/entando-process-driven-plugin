import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MuiTableSortLabel from '@material-ui/core/TableSortLabel';
import withStyles from '@material-ui/styles/withStyles';

const styles = {
  ascActive: {
    '&:hover': {
      '@global svg': {
        transform: 'rotate(180deg)',
      },
    },
  },
  descActive: {
    '&:hover': {
      '@global svg': {
        transform: 'rotate(0deg)',
      },
    },
  },
  notActive: {
    '@global svg': {
      transform: 'rotate(0deg)',
    },
  },
};

const TableSortLabel = ({ direction, classes, active, className, children, onClick }) => {
  return (
    <MuiTableSortLabel
      className={classNames(classes[active ? `${direction}Active` : 'notActive'], className)}
      active={active}
      direction={direction}
      onClick={onClick}
    >
      {children}
    </MuiTableSortLabel>
  );
};

TableSortLabel.propTypes = {
  classes: PropTypes.shape({
    ascActive: PropTypes.string,
    descActive: PropTypes.string,
    notActive: PropTypes.string,
  }),
  direction: PropTypes.oneOf(['asc', 'desc']),
  active: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

TableSortLabel.defaultProps = {
  classes: {},
  direction: 'asc',
  className: '',
};

export default withStyles(styles)(TableSortLabel);
