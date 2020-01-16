import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';

import columnType from 'types/columnType';

export default function InternalTableCell({ column, row }) {
  const CustomCell = column.customCell;
  return (
    <TableCell
      size="small"
      key={column.accessor}
      align={column.align}
      style={{ ...column.styles, whiteSpace: 'nowrap' }}
    >
      {CustomCell ? <CustomCell row={row} /> : row[column.accessor]}
    </TableCell>
  );
}

InternalTableCell.propTypes = {
  column: columnType.isRequired,
  row: PropTypes.shape({}).isRequired,
};
