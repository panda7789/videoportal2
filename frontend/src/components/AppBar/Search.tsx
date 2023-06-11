import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import { alpha, Box, InputBase } from '@mui/material';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Route } from 'routes/RouteNames';

export interface SearchQ {
  searchTerm?: string;
  tags?: string;
}

export async function loader({ request }: { request: any }): Promise<SearchQ> {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q');
  if (searchTerm) {
    return { searchTerm };
  }
  const tags = url.searchParams.get('tags');
  if (tags) {
    return { tags };
  }
  return Promise.reject();
}

export const searchUrl = (searchedParam: string) => {
  return `/${Route.search}?q=${searchedParam}`;
};

export const searchTagsUrl = (searchedTags: string[]) => {
  return `/${Route.search}?tags=${searchedTags.toString()}`;
};

function Search() {
  const [value, setValue] = React.useState<string | null>('');
  const [inputValue, setInputValue] = React.useState('');
  const predmety = ['ISVZ', 'PDF', 'KKS', 'LOL'];
  const navigate = useNavigate();

  const searchButtonClickHandle = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    const params = { q: inputValue };
    if (inputValue?.length === 0 ?? true) {
      return;
    }
    navigate({
      pathname: `/${Route.search}`,
      search: `?${createSearchParams(params)}`,
    });
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
            sx={{
              '& .MuiAutocomplete-endAdornment > button': {
                color: 'white',
              },
            }}
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
                  }}
                  endAdornment={undefined}
                  placeholder="Vyhledávání…"
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') searchButtonClickHandle(event);
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
