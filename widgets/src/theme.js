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
    MuiButton: {
      root: {
        height: '31px',
        borderRadius: '5px',
        fontWeight: 700,
        fontSize: '13px',
        lineHeight: '15px',
        textTransform: 'none',
      },
      containedPrimary: {
        backgroundColor: '#1C84C6',
        '&:hover': {
          backgroundColor: '#135783',
        },
        color: '#FFFEFE',
      },
    },
  },
});
