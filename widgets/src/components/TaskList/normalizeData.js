import ActionCell from 'components/common/Table/custom/ActionCell';
import { compareDates, compareNumbers, compareStrings } from 'components/common/Table/utils';

export const getType = (column, firstRow) => {
  let sortFunction = compareStrings;
  if (firstRow[column] instanceof Date) {
    sortFunction = compareDates;
  } else if (typeof firstRow[column] === 'number') {
    sortFunction = compareNumbers;
  }

  return sortFunction;
};

export const normalizeColumns = (columns, firstRow) => {
  const normalized = columns
    .filter(column => column.isVisible)
    .map(column => ({
      header: column.header,
      accessor: column.name,
      position: column.position,
      sortFunction: getType(column, firstRow),
    }));
  // order columns
  normalized.sort((a, b) => (a.position > b.position ? 1 : a.position < b.position ? -1 : 0));

  // add action field
  normalized.unshift({
    header: 'Action',
    accessor: 'action',
    customCell: ActionCell,
    styles: {
      position: 'sticky',
      left: 0,
      background: 'white',
      width: 20,
      zIndex: 100,
      borderRight: '1px solid #eee',
      paddingRight: 16,
      textAlign: 'center',
    },
  });

  return normalized;
};

export const normalizeRows = rows =>
  rows.map(row => {
    const normalizedRow = {};
    Object.keys(row).forEach(key => {
      if (row[key] instanceof Object) {
        normalizedRow[key] = '';
      } else {
        normalizedRow[key] = String(row[key]);
      }
    });
    return normalizedRow;
  });
