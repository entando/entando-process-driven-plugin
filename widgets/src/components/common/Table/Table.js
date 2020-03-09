import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MuiTable from '@material-ui/core/Table';
import i18next from 'i18next';

import columnType from 'types/columnType';

import SearchInput from 'components/common/SearchInput';
import TableBulkSelectContext from 'components/common/Table/TableBulkSelectContext';
import TablePagination from 'components/common/Table/TablePagination';
import EmptyRow from 'components/common/Table/EmptyRow';
import InternalTableBody from 'components/common/Table/InternalTableBody';
import InternalTableHead from 'components/common/Table/InternalTableHead';
import InternalTablePaginationActions from 'components/common/Table/InternalTablePaginationActions';
import LazyTablePagination from 'components/common/Table/LazyTablePagination';
import TaskListSkeleton from 'components/TaskList/TaskListSkeleton';

export const labelDisplayedRows = ({ from, to, count }) =>
  i18next
    .t('table.showing')
    .replace('$1', from)
    .replace('$2', to)
    .replace('$3', count);

export const swapOrder = order => (order === 'asc' ? 'desc' : 'asc');

const styles = {
  toolbar: {
    justifyContent: 'space-between',
    padding: '16px 16px 8px 16px',
    minHeight: 'unset',
  },
  bulkDropdown: {
    width: 200,
    top: -5,
  },
  noSubtitleToolbar: {
    padding: '8px 16px',
  },
  title: {
    textAlign: 'left',
  },
  hideShadows: {
    boxShadow: 'none',
  },
  tableWrapper: {
    overflow: 'auto',
    position: 'relative',
  },
};

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: props.rowsPerPageOptions[0],
      sortedColumn: props.initialSortedColumn,
      sortFunction:
        props.initialSortedColumn &&
        props.columns.find(column => {
          return column.accessor === props.initialSortedColumn;
        }).sortFunction,
      sortOrder: props.initialSortOrder,
      selected: [],
      filter: '',
      bulkAction: '',
    };
    this.handleRowSelectAll = this.handleRowSelectAll.bind(this);
    this.handleRowSelectNone = this.handleRowSelectNone.bind(this);
    this.handleRowToggleItem = this.handleRowToggleItem.bind(this);
  }

  createSortHandler = property => () => {
    const { columns, lazyLoadingProps } = this.props;

    if (lazyLoadingProps && lazyLoadingProps.onChange) {
      const { sortOrder, sortedColumn, rowsPerPage, filter } = this.state;
      const newSortOder = sortedColumn === property ? swapOrder(sortOrder) : 'asc';
      lazyLoadingProps.onChange(0, rowsPerPage, property, newSortOder, filter, () =>
        this.setState({
          page: 0,
          sortedColumn: property,
          sortOrder: newSortOder,
        })
      );
    } else {
      const { sortFunction } = columns.find(column => {
        return column.accessor === property;
      });

      this.setState(({ sortOrder, sortedColumn }) => ({
        page: 0,
        sortedColumn: property,
        sortFunction,
        sortOrder: sortedColumn === property ? swapOrder(sortOrder) : 'asc',
      }));
    }
  };

  handleChangeRowsPerPage = event => {
    const { lazyLoadingProps } = this.props;
    const { sortedColumn, sortOrder, filter } = this.state;
    const rowsPerPage = event.target.value;

    if (lazyLoadingProps && lazyLoadingProps.onChange) {
      lazyLoadingProps.onChange(0, rowsPerPage, sortedColumn, sortOrder, filter, () =>
        this.setState({ page: 0, rowsPerPage })
      );
    } else {
      this.setState({ page: 0, rowsPerPage });
    }
  };

  handleChangePage = page => {
    const { lazyLoadingProps } = this.props;
    const { rowsPerPage, sortedColumn, sortOrder, filter } = this.state;

    this.setState({ page });
    if (lazyLoadingProps && lazyLoadingProps.onChange) {
      lazyLoadingProps.onChange(page, rowsPerPage, sortedColumn, sortOrder, filter);
    }
  };

  handleChangeFilter = event => {
    const { lazyLoadingProps } = this.props;
    const { rowsPerPage, sortedColumn, sortOrder } = this.state;
    const filter = event.target.value;

    this.setState({ filter });
    if (lazyLoadingProps && lazyLoadingProps.onChange) {
      lazyLoadingProps.onChange(
        0,
        rowsPerPage,
        sortedColumn,
        sortOrder,
        filter,
        () => this.setState({ page: 0, filter }),
        true
      );
    }
  };

  handleRowSelectAll = () => {
    const { rows, rowAccessor } = this.props;
    const selected = rows.map(row => row[rowAccessor]);
    this.setSelected(selected);
  };

  handleRowSelectNone = () => this.setSelected([]);

  handleRowToggleItem = row => {
    const { rowAccessor } = this.props;
    const { selected } = this.state;
    const rowId = row[rowAccessor];
    const nSet = new Set(selected);
    if (nSet.has(rowId)) {
      nSet.delete(rowId);
    } else {
      nSet.add(rowId);
    }
    this.setSelected(Array.from(nSet));
  };

  setSelected = selected => {
    const { onRowSelect } = this.props;
    this.setState({ selected });
    if (onRowSelect) onRowSelect(selected);
  };

  setBulkAction = bulkAction => {
    this.setState({ bulkAction });
  };

  render() {
    const {
      columns,
      rows = [],
      rowAccessor,
      rowsPerPageOptions,
      title,
      subtitle,
      hidePagination,
      classes,
      lazyLoadingProps,
      loading,
    } = this.props;
    const {
      rowsPerPage,
      page,
      sortedColumn,
      sortOrder,
      sortFunction,
      filter,
      selected,
      bulkAction,
    } = this.state;

    const isLazy = lazyLoadingProps !== undefined;
    const hasHeader = title || subtitle;

    let displayRows = rows;
    let rowsSize = rows.length;

    if (!isLazy) {
      // filter rows
      if (filter) {
        displayRows = [];
        rows.forEach(row => {
          const keys = Object.keys(row);
          for (let i = 0; i < keys.length; i += 1) {
            if (
              row[keys[i]] &&
              row[keys[i]]
                .toString()
                .toUpperCase()
                .includes(filter.toUpperCase())
            ) {
              displayRows.push(row);
              break;
            }
          }
        });
        rowsSize = displayRows.length;
      }

      // Sort the rows
      displayRows = sortFunction
        ? displayRows.sort(sortFunction(sortedColumn, sortOrder))
        : displayRows;

      // Slice out the rows for the current page
      const firstRow = page * rowsPerPage;
      const lastRow = firstRow + rowsPerPage;
      displayRows = hidePagination ? displayRows : displayRows.slice(firstRow, lastRow);
    }

    const selectedRows = new Set(selected);

    return loading ? (
      <TaskListSkeleton rows={rowsPerPage} />
    ) : (
      <TableBulkSelectContext.Provider
        value={{
          selectedRows,
          onSelectAll: this.handleRowSelectAll,
          onSelectNone: this.handleRowSelectNone,
          onToggleItem: this.handleRowToggleItem,
        }}
      >
        {hasHeader && (
          <Toolbar className={classNames(classes.toolbar, !subtitle && classes.noSubtitleToolbar)}>
            <div className={classes.title}>
              <Typography variant="h5">{title}</Typography>
              <Typography variant="subtitle2">{subtitle}</Typography>
            </div>
            <div>
              {selected && selected.length ? (
                <FormControl className={classes.bulkDropdown}>
                  <InputLabel id="bulk-select">With Selected:</InputLabel>
                  <Select labelId="bulk-select" value={bulkAction} onChange={this.setBulkAction}>
                    <MenuItem value="claim">Claim</MenuItem>
                    <MenuItem value="unclaim">Unclaim</MenuItem>
                    <MenuItem value="start">Start</MenuItem>
                    <MenuItem value="pause">Pause</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <SearchInput value={filter} onChange={this.handleChangeFilter} />
              )}
            </div>
          </Toolbar>
        )}
        <div className={classes.tableWrapper}>
          <MuiTable className={classNames(!hasHeader && hidePagination && classes.hideShadows)}>
            <InternalTableHead
              columns={columns}
              createSortHandler={this.createSortHandler}
              sortedColumn={sortedColumn}
              sortOrder={sortOrder}
            />
            {displayRows.length ? (
              <InternalTableBody
                columns={columns}
                rows={displayRows}
                rowAccessor={rowAccessor}
                emptyRows={rowsPerPage - displayRows.length}
              />
            ) : (
              <EmptyRow colspan={columns.length} height={rowsPerPage * 55} />
            )}
          </MuiTable>
        </div>
        <MuiTable>
          {!hidePagination && (
            <TableFooter>
              <TableRow>
                {!isLazy ? (
                  <TablePagination
                    colSpan={columns.length}
                    count={rowsSize}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelDisplayedRows={labelDisplayedRows}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={InternalTablePaginationActions}
                    labelRowsPerPage={i18next.t('table.rowsPerPage')}
                  />
                ) : (
                  <LazyTablePagination
                    rowsPerPage={rowsPerPage}
                    page={page}
                    rowsPerPageOptions={rowsPerPageOptions}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    lastPage={lazyLoadingProps.lastPage}
                  />
                )}
              </TableRow>
            </TableFooter>
          )}
        </MuiTable>
      </TableBulkSelectContext.Provider>
    );
  }
}

Table.propTypes = {
  classes: PropTypes.shape({
    toolbar: PropTypes.string,
    noSubtitleToolbar: PropTypes.string,
    title: PropTypes.string,
    hideShadows: PropTypes.string,
    tableWrapper: PropTypes.string,
    bulkDropdown: PropTypes.string,
  }),
  lazyLoadingProps: PropTypes.shape({
    onChange: PropTypes.func,
    size: PropTypes.number,
    lastPage: PropTypes.bool,
  }),
  loading: PropTypes.bool,
  columns: PropTypes.arrayOf(columnType),
  hidePagination: PropTypes.bool,
  rowAccessor: PropTypes.string,
  /** Prop value is required for sortable tables. */
  initialSortedColumn: PropTypes.string,
  initialSortOrder: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.shape({})),
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onRowSelect: PropTypes.func,
};

Table.defaultProps = {
  classes: {},
  loading: false,
  lazyLoadingProps: undefined,
  rowsPerPageOptions: [5, 10, 15],
  title: '',
  subtitle: '',
  hidePagination: false,
  rowAccessor: 'id',
  initialSortedColumn: '',
  initialSortOrder: 'asc',
  rows: [],
  columns: [],
  onRowSelect: null,
};

export default withStyles(styles)(Table);
