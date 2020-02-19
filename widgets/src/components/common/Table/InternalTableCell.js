import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';

import columnType from 'types/columnType';

const InternalTableCell = ({ column, row }) => {
  const CustomCell = column.customCell;

  const StyledTableCell = withStyles(
    {
      root: {
        ...column.styles,
        background: 'white',
        whiteSpace: 'nowrap',
        padding: '9px 16px 10px',
      },
    },
    { name: 'StyledTableCell' }
  )(TableCell);

  return (
    <StyledTableCell size="small" key={column.accessor} align={column.align}>
      {CustomCell ? <CustomCell row={row} /> : row[column.accessor]}
    </StyledTableCell>
  );
};

InternalTableCell.propTypes = {
  column: columnType.isRequired,
  row: PropTypes.shape({}).isRequired,
};

export default InternalTableCell;
