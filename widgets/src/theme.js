import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  typography: {
    h2: {
      color: '#676A6C',
      fontSize: '22px',
      lineHeight: '33px',
    },
    h3: {
      color: '#676A6C',
      fontSize: '18px',
      lineHeight: '25px',
    },
    body1: {
      color: '#696C6E',
      fontSize: '13px',
      lineHeight: '15px',
    },
  },
  overrides: {
    MuiTableCell: {
      head: {
        borderBottom: 'solid 3px #eee',
      },
    },
    MuiFormLabel: {
      root: {
        color: '#676A6C',
        fontSize: '13px',
        lineHeight: '15px',
        fontWeight: 700,
      },
    },
  },
});
