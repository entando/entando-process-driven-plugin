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
    },
    h2: {
      ...entandoUiTheme.typography.h2,
      lineHeight: '33px',
      marginTop: 0,
      marginBottom: 0,
    },
    h3: {
      ...entandoUiTheme.typography.h3,
      lineHeight: '25px',
      marginTop: 0,
      marginBottom: 0,
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
    MuiTableCell: {
      ...entandoUiTheme.overrides.MuiTableCell,
      head: {
        borderBottom: 'solid 3px #eee',
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
        maxWidth: '35em',
        width: '100%',
      },
    },
  },
});
