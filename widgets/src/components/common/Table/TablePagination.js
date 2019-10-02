import TablePagination from '@material-ui/core/TablePagination';
import withStyles from '@material-ui/styles/withStyles';

const styles = {
  spacer: {
    flex: 'unset',
  },
  selectIcon: {
    top: 'calc(50% - 12px)',
    color: 'inherit',
  },
};

export default withStyles(styles)(TablePagination);
