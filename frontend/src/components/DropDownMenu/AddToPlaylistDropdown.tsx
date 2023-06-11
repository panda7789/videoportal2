import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Box,
  ClickAwayListener,
} from '@mui/material';
import { useState } from 'react';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { DropDownMenuCustomActionProps } from 'components/DropDownMenu/DropDownMenu';
import { useMyPlaylistsQuery, useVideoPlaylistsQuery } from 'api/axios-client/Query';
import { AxiosQuery } from 'api';

export function AddToPlaylistDropdown({
  onClose,
  onClick,
  parentObjectId,
}: DropDownMenuCustomActionProps) {
  const [open, setOpen] = useState(false);
  const myPlaylistsQuery = useMyPlaylistsQuery();
  const videoPlaylists = useVideoPlaylistsQuery(
    { id: parentObjectId ?? '' },
    { enabled: parentObjectId !== undefined },
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e: React.MouseEvent<any, MouseEvent> | undefined) => {
    setOpen(false);
    onClose?.(e);
  };

  const handleChange = async (playlistId: string, checked: boolean) => {
    if (!parentObjectId) {
      return;
    }
    await AxiosQuery.Client.video(playlistId, parentObjectId, checked);
    videoPlaylists.refetch();
  };

  return (
    <div>
      <MenuItem
        key="AddToPlaylist"
        onClick={(e: React.MouseEvent<any, MouseEvent>) => {
          onClick?.(e);
          handleClickOpen();
        }}
      >
        <ListItemIcon>
          <PlaylistAddIcon />
        </ListItemIcon>
        <ListItemText>Přidat do playlistu</ListItemText>
      </MenuItem>
      {open && (
        <Dialog
          onClose={(e: any) => {
            e.stopPropagation();
            handleClose(undefined);
          }}
          open={open}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Přidat do playlistu</DialogTitle>
          <DialogContent onClick={(e: React.MouseEvent<any, MouseEvent>) => e.stopPropagation()}>
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
              {myPlaylistsQuery?.data?.map((playlist) => (
                <FormControlLabel
                  key={playlist.id}
                  label={playlist.name}
                  control={
                    <Checkbox
                      checked={videoPlaylists?.data?.includes(playlist.id) ?? false}
                      onChange={(_, checked) => {
                        handleChange(playlist.id, checked);
                      }}
                    />
                  }
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Zavřít</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export function AddToPlaylistDropDownFactory({
  onClose,
  onClick,
  parentObjectId,
}: DropDownMenuCustomActionProps) {
  return (
    <AddToPlaylistDropdown onClose={onClose} onClick={onClick} parentObjectId={parentObjectId} />
  );
}
