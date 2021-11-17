import { createTheme } from '@mui/material/styles';

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

const themePalette = createTheme({
  palette: {
    primary: {
      main: '#30BCED',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FC5130',
    },
  },
});
const themeComponents = createTheme({
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: themePalette.palette.primary.main,
            '& .MuiListItemIcon-root': {
              color: themePalette.palette.primary.main,
            },
          },
        },
      },
    },
  },
});

const theme = createTheme({ ...themePalette, components: themeComponents.components });

export const CustomColors = [
  { name: 'gray', hexValue: '#6D6D6D' },
  { name: 'red', hexValue: '#E10050' },
  { name: 'yellow', hexValue: '#FFB74D' },
  { name: 'blue', hexValue: '#1976D2' },
  { name: 'green', hexValue: '#4CAF50' },
];
export default theme;
