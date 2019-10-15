import { compareDates, compareNumbers, compareStrings } from 'components/common/Table/utils';
import tasks from './tasks.json';

export default function(page, rowsPerPage, sortedColumn, sortOrder = 'asc', filterColumn, filter) {
  let displayRows = tasks.payload;
  // apply filter
  if (filterColumn && filter) {
    displayRows = tasks.payload.find(row =>
      row[filterColumn].toUpperCase().includes(filter.toUpperCase())
    );
  }

  // apply sorting
  let sortFunction = compareStrings;
  if (tasks.payload[0][sortedColumn] instanceof Date) {
    sortFunction = compareDates;
  } else if (tasks.payload[0][sortedColumn] instanceof Number) {
    sortFunction = compareNumbers;
  }

  displayRows = sortedColumn
    ? displayRows.sort(sortFunction(sortedColumn, sortOrder))
    : displayRows;

  // get the desired page
  const firstRow = page * rowsPerPage;
  const lastRow = firstRow + rowsPerPage;
  displayRows = page && rowsPerPage ? displayRows.slice(firstRow, lastRow) : displayRows;

  return {
    payload: displayRows,
    metadata: {
      size: tasks.payload.length,
    },
  };
}
