import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#30BCED',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FC5130',
    },
  },
};

const theme = createTheme(themeOptions);
export default theme;
