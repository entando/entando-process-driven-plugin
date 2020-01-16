import PropTypes from 'prop-types';
import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import i18next from 'i18next';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageControl: {
    display: 'flex',
    alignItems: 'center',
  },
  previousIcon: {
    transform: 'rotate(180deg)',
  },
  select: {
    textAlign: 'right',
    textAlignLast: 'right',
    marginLeft: 8,
    fontSize: 'inherit',
    '&:before, &:hover:before': {
      content: 'none',
    },
  },
};

class LazyTablePagination extends React.Component {
  handleFirstPageButtonClick = () => {
    const { onChangePage } = this.props;
    onChangePage(0);
  };

  handlePrevButtonClick = () => {
    const { onChangePage, page } = this.props;
    onChangePage(page - 1);
  };

  handleNextButtonClick = () => {
    const { onChangePage, page } = this.props;
    onChangePage(page + 1);
  };

  handleRowsPerPage = e => {
    const { onChangeRowsPerPage } = this.props;
    onChangeRowsPerPage(e);
  };

  render() {
    const { page, rowsPerPage, rowsPerPageOptions, lastPage, classes } = this.props;

    return (
      <TableCell className={classes.root}>
        <div className={classes.pageControl}>
          <Typography variant="caption">{i18next.t('table.rowsPerPage')}</Typography>
          <Select value={rowsPerPage} className={classes.select} onChange={this.handleRowsPerPage}>
            {rowsPerPageOptions.map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.pageControl}>
          <IconButton size="small" onClick={this.handleFirstPageButtonClick} disabled={page === 0}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton size="small" onClick={this.handlePrevButtonClick} disabled={page === 0}>
            <PlayArrowIcon className={classes.previousIcon} />
          </IconButton>

          <Typography>{page + 1}</Typography>

          <IconButton size="small" onClick={this.handleNextButtonClick} disabled={lastPage}>
            <PlayArrowIcon />
          </IconButton>
        </div>
      </TableCell>
    );
  }
}

LazyTablePagination.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    previousIcon: PropTypes.string,
    pageControl: PropTypes.string,
    select: PropTypes.string,
  }),
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  lastPage: PropTypes.bool.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
};

LazyTablePagination.defaultProps = {
  classes: {},
};

export default withStyles(styles)(LazyTablePagination);
