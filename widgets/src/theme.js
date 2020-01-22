import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    text: {
      primary: '#676A6C',
    },
  },
  overrides: {
    MuiTableCell: {
      head: {
        borderBottom: 'solid 3px #eee',
      },
    },
  },
});
