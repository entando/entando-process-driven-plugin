import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import rowType from 'types/rowType';

const DateCell = rowName => {
  const Cell = ({ row }) => <span>{moment(row[rowName]).format('MM/DD/YYYY')}</span>;

  Cell.propTypes = {
    row: rowType.isRequired,
  };

  return Cell;
};

DateCell.propTypes = {
  rowName: PropTypes.string.isRequired,
};

export default DateCell;
