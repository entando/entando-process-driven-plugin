import React from 'react';
import TableCell from '@material-ui/core/TableCell';

import columnType from 'types/columnType';
import rowType from 'types/rowType';

export default function InternalTableCell({ column, row }) {
  const CustomCell = column.customCell;
  return (
    <TableCell key={column.accessor} align={column.align} style={{ ...column.styles }}>
      {CustomCell ? <CustomCell row={row} /> : row[column.accessor]}
    </TableCell>
  );
}

InternalTableCell.propTypes = {
  column: columnType.isRequired,
  row: rowType.isRequired,
};
