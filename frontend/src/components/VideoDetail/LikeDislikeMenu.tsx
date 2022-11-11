import { ContentCut, ContentCopy, ContentPaste, Cloud } from '@mui/icons-material';
import {
  Stack,
  IconButton,
  Typography,
  Paper,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  styled,
  Menu,
  Snackbar,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import QueueIcon from '@mui/icons-material/Queue';
import React from 'react';
import theme from 'Theme';
import { UserVideoStats } from 'model/Video';

export interface LikeDislikeMenuProps extends UserVideoStats {
  likeCount: number;
  dislikeCount: number;
}

const Item = styled(Box)(() => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '48px',
}));

function LikeDislikeMenu({
  likeCount,
  dislikeCount,
  like,
  dislike,
  addedToPlaylist,
}: LikeDislikeMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleAddToPlaylistClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAddToPlaylistClose = () => {
    setAnchorEl(null);
  };
  const handleLikeClick = () => {
    // todo send like to api
  };
  const handleDislikeClick = () => {
    // todo send dislike to api
  };
  const handleShareClick = () => {
    navigator.clipboard.writeText('odkaz na video');
    setSnackbarOpen(true);
  };
  const handleShareClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      marginLeft={2}
      marginRight={2}
      height="38px"
      marginTop={2}
    >
      <Item>
        <IconButton color={like ? 'primary' : 'default'} onClick={handleLikeClick}>
          <ThumbUpIcon />
        </IconButton>
        <Typography>{likeCount}</Typography>
      </Item>
      <Item>
        <IconButton color={dislike ? 'primary' : 'default'} onClick={handleDislikeClick}>
          <ThumbDownIcon />
        </IconButton>
        <Typography>{dislikeCount}</Typography>
      </Item>
      <Item>
        <IconButton onClick={handleShareClick}>
          <ShareIcon />
        </IconButton>
        <Typography>Sdílení</Typography>
      </Item>
      <Item>
        <IconButton
          color={addedToPlaylist ? 'primary' : 'default'}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleAddToPlaylistClick}
        >
          <QueueIcon />
        </IconButton>
        <Typography>Uložit</Typography>
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleAddToPlaylistClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <ContentCut fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cut</ListItemText>
              <Typography variant="body2" color="text.secondary">
                ⌘X
              </Typography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
              <Typography variant="body2" color="text.secondary">
                ⌘C
              </Typography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPaste fontSize="small" />
              </ListItemIcon>
              <ListItemText>Paste</ListItemText>
              <Typography variant="body2" color="text.secondary">
                ⌘V
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Web Clipboard</ListItemText>
            </MenuItem>
          </Menu>
        </Paper>
      </Item>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={handleShareClose}
        autoHideDuration={4000}
        message="Odkaz byl zkopírován do schránky!"
      />
    </Stack>
  );
}
export default LikeDislikeMenu;
