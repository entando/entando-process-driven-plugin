import PropTypes from 'prop-types';
import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import columnType from 'types/columnType';
import TableBulkSelectContext from 'components/common/Table/TableBulkSelectContext';
import withStyles from '@material-ui/core/styles/withStyles';
import InternalTableCell from './InternalTableCell';

const StyledTableRowHover = withStyles(
  {
    root: {
      color: '#e7eaec',
      '&:hover > *': {
        backgroundColor: '#f9f8f8',
        cursor: 'pointer',
      },
    },
  },
  { name: 'StyledTableRowHover' }
)(TableRow);

const InternalTableBody = ({ columns, rows, emptyRows, rowHeight, onRowClick }) => {
  return (
    <TableBody>
      {rows.map((row, idx) => (
        <TableBulkSelectContext.Consumer key={JSON.stringify(row)}>
          {({ selectedRows, rowAccessor }) => (
            <StyledTableRowHover
              style={{ height: rowHeight, cursor: row.onClick ? 'pointer' : 'initial' }}
              hover
              selected={selectedRows.has(row[rowAccessor])}
              onClick={e => {
                onRowClick(row, idx, e);
              }}
            >
              {columns.map(column => (
                <InternalTableCell key={JSON.stringify(column)} column={column} row={row} />
              ))}
            </StyledTableRowHover>
          )}
        </TableBulkSelectContext.Consumer>
      ))}
      {emptyRows > 0 && (
        <TableRow style={{ height: rowHeight * emptyRows, background: 'white' }}>
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
  onRowClick: PropTypes.func,
};

InternalTableBody.defaultProps = {
  columns: [],
  rows: [],
  emptyRows: 0,
  rowHeight: 55,
  onRowClick: () => {},
};

export default InternalTableBody;
