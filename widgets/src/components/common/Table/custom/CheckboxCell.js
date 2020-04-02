import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import TableBulkSelectContext from 'components/common/Table/TableBulkSelectContext';

export const StyledCheckbox = withStyles({
  root: {
    padding: '3px 5px',
  },
})(Checkbox);

const CheckboxCell = () => ({ row }) => (
  <TableBulkSelectContext.Consumer>
    {({ selectedRows, onToggleItem }) => {
      const onChangeRow = () => onToggleItem(row);
      return (
        <StyledCheckbox checked={selectedRows.has(row.id)} value={row.id} onChange={onChangeRow} />
      );
    }}
  </TableBulkSelectContext.Consumer>
);

export default CheckboxCell;
