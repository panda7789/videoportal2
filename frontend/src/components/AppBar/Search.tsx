import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import { alpha, Box, InputBase } from '@mui/material';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Route } from 'routes/RouteNames';
import { useTagsAllQuery } from 'api/axios-client/Query';

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

const searchQuery = (searchedParam: string) => `?q=${searchedParam}`;
const searchTagsQuery = (searchedTags: string[]) => `?q=tags:${searchedTags.toString()}`;

export const searchUrl = (searchedParam: string) => {
  return `/${Route.search}${searchQuery(searchedParam)}`;
};

export const searchTagsUrl = (searchedTags: string[]) => {
  return `/${Route.search}${searchTagsQuery(searchedTags)}`;
};

function Search() {
  const [value, setValue] = React.useState<string | null>('');
  const [inputValue, setInputValue] = React.useState('');
  const tags = useTagsAllQuery();
  const navigate = useNavigate();

  const searchButtonClickHandle = () => {
    if (inputValue?.length === 0 ?? true) {
      return;
    }
    navigate({
      pathname: `/${Route.search}`,
      search: searchQuery(inputValue),
    });
  };

  const selectedTag = (tag: string) => {
    navigate({
      pathname: `/${Route.search}`,
      search: searchTagsQuery([tag]),
    });
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
            onChange={(_: any, newValue: string | null) => {
              setValue(newValue);
              if (newValue) {
                selectedTag(newValue);
              }
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
              setInputValue(newInputValue);
              searchButtonClickHandle();
            }}
            options={[...(tags?.data?.map((x) => `${x.name}`) ?? [])]}
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
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      searchButtonClickHandle();
                    }
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
