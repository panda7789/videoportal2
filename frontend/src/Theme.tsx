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
    MuiLink: {
      styleOverrides: {
        button: {
          color: 'rgba(0, 0, 0, 0.87)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        subtitle2: {
          lineHeight: 'normal',
        },
        caption: {
          lineHeight: 'normal',
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

export enum Faculty {
  'Cyrilometodejska',
  'Filozoficka',
  'Lekarska',
  'Prirodovedecka',
  'Pedagogicka',
  'Telesne_kultury',
  'Pravnicka',
  'Zdravotnich_ved',
}

export const FacultyColors = {
  [Faculty.Cyrilometodejska]: '#9E82B5',
  [Faculty.Filozoficka]: '#3AB0E1',
  [Faculty.Lekarska]: '#B62846',
  [Faculty.Prirodovedecka]: '#EB6D25',
  [Faculty.Pedagogicka]: '#E7AE05',
  [Faculty.Telesne_kultury]: '#099652',
  [Faculty.Pravnicka]: '#58507F',
  [Faculty.Zdravotnich_ved]: '#B2C918',
};

export const GetColorByFaculty = (faculty: Faculty) => {
  return FacultyColors[faculty];
};
export default theme;
