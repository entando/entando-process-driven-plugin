import React from 'react';

const TableBulkSelectContext = React.createContext({ selectedRows: new Set() });
TableBulkSelectContext.displayName = 'TableBulkSelectContext';

export default TableBulkSelectContext;
