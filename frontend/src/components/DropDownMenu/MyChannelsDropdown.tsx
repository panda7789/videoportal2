import { TextField, MenuItem, IconButton } from '@mui/material';
import { ChannelDTO } from 'api/axios-client';
import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

export interface Props {
  channels?: ChannelDTO[];
  defaultValue?: string;
  required?: boolean;
}

export function MyChannelsDropdown({ channels, defaultValue, required = false }: Props) {
  const [value, setValue] = useState<string | undefined>(
    defaultValue ?? (channels?.length === 1 ? channels[0].id : ''),
  );

  return (
    <TextField
      fullWidth
      name="channelSelect"
      select={(channels?.length ?? 0) > 0}
      required={required}
      label="Kanál"
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
      {channels?.map((channel) => (
        <MenuItem key={channel.id} value={channel.id}>
          {channel.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
