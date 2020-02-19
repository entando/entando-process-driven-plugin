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

export const normalizeColumns = (columns, firstRow, options, { openDiagram, selectTask }) => {
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

  // find required fields according to options
  const requiredFields = options.reduce((obj, option) => {
    obj[option.key] = option.checked;
    return obj;
  }, {});

  // add action field
  normalized.unshift({
    header: 'Action',
    accessor: 'action',
    customCell: ActionCell(requiredFields, { openDiagram, selectTask }),
    styles: {
      position: 'sticky',
      left: 0,
      width: 20,
      zIndex: 100,
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

export const normalizeConfigColumns = columns =>
  columns.map((column, i) => ({
    name: column,
    position: i,
    isVisible: true,
  }));

export const normalizeConfigGroups = groups =>
  groups.map(group => ({
    label: group,
    key: group,
    checked: true,
  }));
