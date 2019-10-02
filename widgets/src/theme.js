import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  overrides: {
    MuiTableCell: {
      head: {
        borderBottom: 'solid 3px #eee',
      },
    },
  },
});
