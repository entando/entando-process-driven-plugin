import PropTypes from 'prop-types';
import React from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import i18next from 'i18next';

const styles = {
  root: {
    marginLeft: 'auto',
    marginRight: 20,
    display: 'flex',
    alignItems: 'center',
  },
  previousIcon: {
    transform: 'rotate(180deg)',
  },
  pageNumberInput: {
    marginRight: 10,
  },
};

class InternalTablePaginationActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: props && props.page + 1,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const lastPage = Math.floor(props.count / props.rowsPerPage);
    if (props.page === lastPage || props.page !== +state.pageNumber + 1) {
      return { pageNumber: props.page + 1 };
    }
    return state;
  }

  componentDidMount() {
    const { page } = this.props;
    this.setPageNumber(page + 1);
  }

  get numberOfPages() {
    const { count, rowsPerPage } = this.props;
    return Math.ceil(count / rowsPerPage);
  }

  setPageNumber = pageNumber => {
    this.setState({ pageNumber });
  };

  handlePageNumberInputChange = event => {
    const { value } = event.target;
    const { onChangePage } = this.props;
    // sync state and entered value
    this.setPageNumber(value);
    // navigate to entered page number if valid
    const pageNumber = +value;
    if (pageNumber && pageNumber <= this.numberOfPages) {
      onChangePage(pageNumber - 1);
    }
  };

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

  handleLastPageButtonClick = () => {
    const { onChangePage, count, rowsPerPage } = this.props;
    onChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  render() {
    const { page, count, rowsPerPage, classes } = this.props;
    const { pageNumber } = this.state;
    const numberOfDigits = `${this.numberOfPages}`.length;

    return (
      <div className={classes.root}>
        <IconButton size="small" onClick={this.handleFirstPageButtonClick} disabled={page === 0}>
          <SkipPreviousIcon />
        </IconButton>

        <IconButton size="small" onClick={this.handlePrevButtonClick} disabled={page === 0}>
          <PlayArrowIcon className={classes.previousIcon} />
        </IconButton>

        <TextField
          className={classes.pageNumberInput}
          style={{ width: 25 + 10 * numberOfDigits }}
          value={pageNumber}
          onChange={event => this.handlePageNumberInputChange(event)}
        />

        <Typography>{`${i18next.t('common.of')} ${this.numberOfPages}`}</Typography>

        <IconButton
          size="small"
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          <PlayArrowIcon />
        </IconButton>

        <IconButton
          size="small"
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        >
          <SkipNextIcon />
        </IconButton>
      </div>
    );
  }
}

InternalTablePaginationActions.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    previousIcon: PropTypes.string,
    pageNumberInput: PropTypes.string,
  }),
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

InternalTablePaginationActions.defaultProps = {
  classes: {},
};

export default withStyles(styles)(InternalTablePaginationActions);
