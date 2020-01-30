import PropTypes from 'prop-types';
import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import columnType from 'types/columnType';
import InternalTableCell from './InternalTableCell';

const InternalTableBody = ({ columns, rows, emptyRows, rowHeight }) => {
  return (
    <TableBody>
      {rows.map(row => (
        <TableRow
          key={JSON.stringify(row)}
          style={{ height: rowHeight, cursor: row.onClick ? 'pointer' : 'initial' }}
          hover
        >
          {columns.map(column => (
            <InternalTableCell key={JSON.stringify(column)} column={column} row={row} />
          ))}
        </TableRow>
      ))}
      {emptyRows > 0 && (
        <TableRow style={{ height: rowHeight * emptyRows }}>
          <TableCell />
        </TableRow>
      )}
    </TableBody>
  );
};

InternalTableBody.propTypes = {
  columns: PropTypes.arrayOf(columnType),
  rows: PropTypes.arrayOf(PropTypes.shape({})),
  emptyRows: PropTypes.number,
  rowHeight: PropTypes.number,
};

InternalTableBody.defaultProps = {
  columns: [],
  rows: [],
  emptyRows: 0,
  rowHeight: 55,
};

export default InternalTableBody;
