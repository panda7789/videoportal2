import { TextField, MenuItem } from '@mui/material';
import { ChannelDTO } from 'api/axios-client';

export interface Props {
  channels?: ChannelDTO[];
  defaultValue?: string;
}

export function MyChannelsDropdown({ channels, defaultValue }: Props) {
  return (
    <TextField
      fullWidth
      name="channelSelect"
      select={(channels?.length ?? 0) > 0}
      required
      label="Kanál"
      defaultValue={defaultValue ?? (channels?.length === 1 ? channels[0].id : '')}
    >
      {channels?.map((channel) => (
        <MenuItem key={channel.id} value={channel.id}>
          {channel.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
