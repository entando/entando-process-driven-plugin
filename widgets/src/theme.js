import { createMuiTheme } from '@material-ui/core/styles';
import entandoUiTheme from '@entando/ui';

export default createMuiTheme({
  ...entandoUiTheme,
  typography: {
    ...entandoUiTheme.typography,
    h1: {
      ...entandoUiTheme.typography.h1,
      marginTop: 0,
      marginBottom: 0,
      fontWeight: 'normal',
    },
    h2: {
      ...entandoUiTheme.typography.h2,
      lineHeight: '33px',
      marginTop: 0,
      marginBottom: 0,
      fontWeight: 'normal',
    },
    h3: {
      ...entandoUiTheme.typography.h3,
      lineHeight: '25px',
      marginTop: 0,
      marginBottom: 0,
      fontWeight: 'normal',
    },
    h4: {
      ...entandoUiTheme.typography.h4,
      marginTop: 0,
      marginBottom: 0,
    },
    h5: {
      ...entandoUiTheme.typography.h5,
      marginTop: 0,
      marginBottom: 0,
    },
    body1: {
      ...entandoUiTheme.typography.body1,
      color: '#696C6E',
      lineHeight: '15px',
    },
  },
  palette: {
    ...entandoUiTheme.palette,
    primary: {
      light: '#62b3f9',
      main: '#1c84c6',
      dark: '#005895',
      contrastText: '#fff',
    },
    text: {
      ...entandoUiTheme.palette.text,
      primary: '#676A6C',
    },
  },
  overrides: {
    ...entandoUiTheme.overrides,
    MuiTable: {
      ...entandoUiTheme.overrides.MuiTable,
      root: {
        borderCollapse: 'collapse',
      },
    },
    MuiTableCell: {
      ...entandoUiTheme.overrides.MuiTableCell,
      root: {
        border: 0,
        padding: '.5rem',
      },
      head: {
        borderBottom: 'solid 3px #eee',
      },
      footer: {
        backgroundColor: '#fff',
      },
    },
    MuiFormLabel: {
      ...entandoUiTheme.overrides.MuiFormLabel,
      root: {
        color: '#676A6C',
        fontSize: '13px',
        lineHeight: '15px',
        fontWeight: 700,
      },
    },
    MuiButton: {
      ...entandoUiTheme.overrides.MuiButton,
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
    MuiInputBase: {
      ...entandoUiTheme.overrides.MuiInputBase,
      input: {
        ...entandoUiTheme.overrides.MuiInputBase.input,
        width: '100%',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 30,
      },
    },
  },
});
