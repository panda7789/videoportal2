import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import { alpha, Box, InputBase } from '@mui/material';

function Search() {
  const [value, setValue] = React.useState<string | null>('');
  const [inputValue, setInputValue] = React.useState('');
  const predmety = ['ISVZ', 'PDF', 'KKS', 'LOL'];

  const searchButtonClickHandle = () => {
    console.log(`/api/search?q=${inputValue}`);
  };

  const selectedOption = (option: string | null) => {
    console.log(`/api/search?q=${option}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: ['100%', '50%'],
      }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: 1,
          backgroundColor: alpha('#fff', 0.15),
          '&:hover': {
            backgroundColor: alpha('#fff', 0.25),
          },
          width: '100%',
        }}
      >
        <IconButton
          sx={{
            color: '#FFF',
            padding: '0,5',
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: '#40CCFD',
            },
          }}
          onClick={searchButtonClickHandle}
        >
          <SearchIcon />
        </IconButton>
        <form id="search-form" role="search">

        <Autocomplete
          id="free-solo-demo"
          freeSolo
          value={value}
          onChange={(event: any, newValue: string | null) => {
            setValue(newValue);
            selectedOption(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={predmety}
          renderInput={(params) => {
            const { InputLabelProps, InputProps, ...rest } = params;
            return (
              <InputBase
                {...params.InputProps}
                {...rest}
                name="q"
                type="search"
                sx={{
                  color: 'white',
                  '& .MuiInputBase-input': {
                    width: '100%',
                    paddingLeft: 4,
                  },
                  '& .MuiAutocomplete-endAdornment > button': {
                    color: 'white',
                  },
                }}
                placeholder="Vyhledávání…"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') searchButtonClickHandle();
                }}
              />
            );
          }}
          />
        </form>
      </Box>
    </Box>
  );
}

export default Search;
