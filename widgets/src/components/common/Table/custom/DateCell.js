import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const DateCell = rowName => {
  const Cell = ({ row }) => <span>{moment(row[rowName]).format('MM/DD/YYYY')}</span>;

  Cell.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    row: PropTypes.object.isRequired,
  };

  return Cell;
};

DateCell.propTypes = {
  rowName: PropTypes.string.isRequired,
};

export default DateCell;
