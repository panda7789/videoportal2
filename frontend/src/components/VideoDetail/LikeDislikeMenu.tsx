import { Stack, IconButton, Typography, Box, styled, Snackbar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import QueueIcon from '@mui/icons-material/Queue';
import React from 'react';
import theme from 'Theme';
import DropDownMenu, { DropDownMenuAction } from 'components/DropDownMenu/DropDownMenu';
import { AxiosQuery } from 'api';
import { useUserVideoStatsGETQuery, useUserVideoStatsPUTMutation } from 'api/axios-client/Query';
import { UserVideoStats } from 'api/axios-client';

export interface Props {
  videoId: string;
  likeCount: string;
  dislikeCount: string;
  enabled?: boolean;
}

const Item = styled(Box)(() => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '48px',
}));

const dropdownActions: DropDownMenuAction[] = [
  {
    name: 'Přehrát později',
    icon: <WatchLaterIcon />,
    onClick: () => console.log('přidat do přehrát později'),
  },
  {
    name: 'Přidat do playlistu',
    icon: <PlaylistAddIcon />,
    onClick: () => console.log('přidat do playlistu'),
  },
];

function LikeDislikeMenu({ likeCount, dislikeCount, videoId, enabled = true }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const videoUserStatsQuery = useUserVideoStatsGETQuery({ videoId });
  const videoUserStatsMutation = useUserVideoStatsPUTMutation(videoId);

  const open = Boolean(anchorEl);
  const handleAddToPlaylistClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAddToPlaylistClose = () => {
    setAnchorEl(null);
  };
  const handleLikeClick = () => {
    // todo send like to api
    if (videoUserStatsQuery?.data) {
      videoUserStatsMutation.mutateAsync(
        new UserVideoStats({
          ...videoUserStatsQuery?.data,
          like: true,
          dislike: false,
        }),
      );
    }
  };
  const handleDislikeClick = () => {
    // todo send dislike to api
    if (videoUserStatsQuery?.data) {
      videoUserStatsMutation.mutateAsync(
        new UserVideoStats({
          ...videoUserStatsQuery?.data,
          like: false,
          dislike: true,
        }),
      );
    }
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
        <IconButton
          color={videoUserStatsQuery?.data?.like ? 'primary' : 'default'}
          onClick={handleLikeClick}
          disabled={!enabled}
        >
          <ThumbUpIcon />
        </IconButton>
        <Typography>{likeCount}</Typography>
      </Item>
      <Item>
        <IconButton
          color={videoUserStatsQuery?.data?.dislike ? 'primary' : 'default'}
          onClick={handleDislikeClick}
          disabled={!enabled}
        >
          <ThumbDownIcon />
        </IconButton>
        <Typography>{dislikeCount}</Typography>
      </Item>
      <Item>
        <IconButton
          disabled={!enabled}
          onClick={handleShareClick}
          color={videoUserStatsQuery?.data?.addedToPlaylist ? 'success' : 'default'}
        >
          <ShareIcon />
        </IconButton>
        <Typography>Sdílení</Typography>
      </Item>
      <Item>
        <DropDownMenu
          actions={dropdownActions}
          text="Uložit"
          icon={<QueueIcon />}
          enabled={enabled}
        />
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
