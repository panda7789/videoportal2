import { TextField, MenuItem, IconButton } from '@mui/material';
import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { useMyPlaylistsQuery } from 'api/axios-client/Query';

export interface Props {
  defaultValue?: string;
  required?: boolean;
}
export function MyPlaylistsDropdown({ defaultValue, required = false }: Props) {
  const playlists = useMyPlaylistsQuery();
  const [value, setValue] = useState<string | undefined>(
    defaultValue ?? (playlists.data?.length === 1 ? playlists.data[0].id : ''),
  );

  return (
    <TextField
      fullWidth
      name="playlistSelect"
      select={(playlists.data?.length ?? 0) > 0}
      required={required}
      label="Playlist"
      value={value}
      onChange={(newValue) => {
        setValue(newValue.target.value);
      }}
      InputProps={{
        endAdornment: (
          <IconButton
            sx={{ display: value ? undefined : 'none', marginRight: '8px' }}
            onClick={() => setValue(undefined)}
          >
            <ClearIcon />
          </IconButton>
        ),
      }}
    >
      {playlists.data?.map((playlist) => (
        <MenuItem key={playlist.id} value={playlist.id}>
          {playlist.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
