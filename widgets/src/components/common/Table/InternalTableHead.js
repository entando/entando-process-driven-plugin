import PropTypes from 'prop-types';
import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import columnType from 'types/columnType';
import InternalTableHeader from 'components/common/Table/InternalTableHeader';

export default function InternalTableHead({ columns, createSortHandler, sortedColumn, sortOrder }) {
  return (
    <TableHead>
      <TableRow>
        {columns.map(column => (
          <InternalTableHeader
            key={JSON.stringify(column)}
            column={column}
            createSortHandler={createSortHandler}
            sortedColumn={sortedColumn}
            sortOrder={sortOrder}
          />
        ))}
      </TableRow>
    </TableHead>
  );
}

InternalTableHead.propTypes = {
  columns: PropTypes.arrayOf(columnType).isRequired,
  createSortHandler: PropTypes.func,
  sortedColumn: PropTypes.string,
  sortOrder: PropTypes.string,
};

InternalTableHead.defaultProps = {
  createSortHandler: () => () => {},
  sortedColumn: '',
  sortOrder: 'asc',
};
