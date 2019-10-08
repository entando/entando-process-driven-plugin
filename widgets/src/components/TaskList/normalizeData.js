import ActionCell from 'components/common/Table/custom/ActionCell';

export const normalizeColumns = columns => {
  const normalized = columns
    .filter(column => column.visible)
    .map(column => ({
      header: column.header,
      accessor: column.key,
      position: column.position,
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
