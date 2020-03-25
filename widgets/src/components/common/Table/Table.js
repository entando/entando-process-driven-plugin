import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import MuiTable from '@material-ui/core/Table';
import i18next from 'i18next';

import columnType from 'types/columnType';

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
        props.columns.find(column => column.accessor === props.initialSortedColumn).sortFunction,
      sortOrder: props.initialSortOrder,
      filter: '',
    };
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
    const { lazyLoadingProps, onChangePage } = this.props;
    const { sortedColumn, sortOrder, filter } = this.state;
    const rowsPerPage = event.target.value;

    if (lazyLoadingProps && lazyLoadingProps.onChange) {
      lazyLoadingProps.onChange(0, rowsPerPage, sortedColumn, sortOrder, filter, () =>
        this.setState({ page: 0, rowsPerPage })
      );
    } else {
      this.setState({ page: 0, rowsPerPage });
    }

    onChangePage(0);
  };

  handleChangePage = page => {
    const { lazyLoadingProps, onChangePage } = this.props;
    const { rowsPerPage, sortedColumn, sortOrder, filter } = this.state;

    this.setState({ page });

    onChangePage(page);

    if (lazyLoadingProps && lazyLoadingProps.onChange) {
      lazyLoadingProps.onChange(page, rowsPerPage, sortedColumn, sortOrder, filter);
    }
  };

  render() {
    const {
      columns,
      rows = [],
      rowsPerPageOptions,
      hidePagination,
      classes,
      lazyLoadingProps,
      loading,
      onRowClick,
    } = this.props;
    const { rowsPerPage, page, sortedColumn, sortOrder, sortFunction, filter } = this.state;

    const isLazy = lazyLoadingProps !== undefined;

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

    return loading ? (
      <TaskListSkeleton rows={rowsPerPage} />
    ) : (
      <>
        <div className={classes.tableWrapper}>
          <MuiTable className={classNames(hidePagination && classes.hideShadows)}>
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
                emptyRows={rowsPerPage - displayRows.length}
                onRowClick={onRowClick}
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
      </>
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
  }),
  lazyLoadingProps: PropTypes.shape({
    onChange: PropTypes.func,
    size: PropTypes.number,
    lastPage: PropTypes.bool,
  }),
  loading: PropTypes.bool,
  columns: PropTypes.arrayOf(columnType),
  hidePagination: PropTypes.bool,
  /** Prop value is required for sortable tables. */
  initialSortedColumn: PropTypes.string,
  initialSortOrder: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.shape({})),
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  onRowClick: PropTypes.func,
  onChangePage: PropTypes.func,
};

Table.defaultProps = {
  classes: {},
  loading: false,
  lazyLoadingProps: undefined,
  rowsPerPageOptions: [5, 10, 15],
  hidePagination: false,
  initialSortedColumn: '',
  initialSortOrder: 'asc',
  rows: [],
  columns: [],
  onRowClick: () => {},
  onChangePage: () => {},
};

export default withStyles(styles)(Table);
