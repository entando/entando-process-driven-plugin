import PropTypes from 'prop-types';
import React from 'react';
import TableCell from '@material-ui/core/TableCell';

import columnType from 'types/columnType';
import TableSortLabel from 'components/common/Table/TableSortLabel';
import withStyles from '@material-ui/core/styles/withStyles';

const StyledHeaderCell = withStyles(
  {
    head: {
      backgroundColor: '#e5e6e7',
      color: '#323233',
      fontWeight: 'bold',
      borderBottom: '1px solid #e7eaec',
      padding: '9px 16px 10px',
    },
  },
  { name: 'StyledHeaderCell' }
)(TableCell);

function InternalTableHeader({ column, createSortHandler, sortedColumn, sortOrder }) {
  const label = column.header || column.accessor;
  const header = column.sortFunction ? (
    <TableSortLabel
      key={column.accessor}
      active={column.accessor === sortedColumn}
      onClick={createSortHandler(column.accessor)}
      direction={sortOrder}
    >
      {label}
    </TableSortLabel>
  ) : (
    label
  );

  return (
    <StyledHeaderCell
      variant="head"
      key={column.accessor}
      align={column.align}
      style={{ whiteSpace: 'nowrap', ...column.styles }}
    >
      {header}
    </StyledHeaderCell>
  );
}

InternalTableHeader.propTypes = {
  column: columnType.isRequired,
  sortOrder: PropTypes.string.isRequired,
  createSortHandler: PropTypes.func,
  sortedColumn: PropTypes.string,
};

InternalTableHeader.defaultProps = {
  createSortHandler: () => () => {},
  sortedColumn: '',
};

export default InternalTableHeader;
