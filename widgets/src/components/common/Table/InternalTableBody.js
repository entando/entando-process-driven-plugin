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
      '& > *': {
        backgroundColor: '#ffffff',
      },
      '&.activeTask > *': {
        backgroundColor: '#e8f3f9',
      },
      '&:hover > *': {
        backgroundColor: '#f9f8f8',
        cursor: 'pointer',
      },
    },
    selected: {
      '& > *': {
        backgroundColor: '#f4f6f7',
      },
      '&.activeTask > *': {
        backgroundColor: '#dce7ed',
      },
    },
  },
  { name: 'StyledTableRowHover' }
)(TableRow);

const InternalTableBody = ({ columns, rows, emptyRows, rowHeight, onRowClick, activeTaskId }) => {
  return (
    <TableBody>
      {rows.map((row, idx) => (
        <TableBulkSelectContext.Consumer key={JSON.stringify(row)}>
          {({ selectedRows, rowAccessor }) => (
            <StyledTableRowHover
              style={{ height: rowHeight, cursor: row.onClick ? 'pointer' : 'initial' }}
              hover
              className={row.id === activeTaskId ? 'activeTask' : ''}
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
          <TableCell colspan={columns.length} />
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
  activeTaskId: PropTypes.string,
};

InternalTableBody.defaultProps = {
  columns: [],
  rows: [],
  emptyRows: 0,
  rowHeight: 55,
  onRowClick: () => {},
  activeTaskId: '',
};

export default InternalTableBody;
