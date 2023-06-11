import { Stack, IconButton, Typography, Box, styled, Snackbar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import QueueIcon from '@mui/icons-material/Queue';
import React, { useState } from 'react';
import theme from 'Theme';
import DropDownMenu, {
  DropDownMenuAction,
  DropDownMenuCustomAction,
} from 'components/DropDownMenu/DropDownMenu';
import { AxiosQuery } from 'api';
import { useUserVideoStatsPUTMutation } from 'api/axios-client/Query';
import { UserVideoStats } from 'api/axios-client';
import { NumberToWords } from 'components/Utils/NumberUtils';
import { UseQueryResult } from '@tanstack/react-query';
import { AddToPlaylistDropDownFactory } from 'components/DropDownMenu/AddToPlaylistDropdown';

export interface Props {
  videoId: string;
  likeCount: number;
  dislikeCount: number;
  enabled?: boolean;
  userStatsQuery?: UseQueryResult<AxiosQuery.UserVideoStats, unknown>;
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
  videoId,
  userStatsQuery,
  enabled = true,
}: Props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const videoUserStatsMutation = useUserVideoStatsPUTMutation(videoId, {
    onSuccess: () => {
      userStatsQuery?.refetch();
    },
  });
  const dropdownActions: (DropDownMenuAction | DropDownMenuCustomAction)[] = [
    {
      name: 'Přehrát později',
      icon: <WatchLaterIcon />,
      onClick: () => console.log('přidat do přehrát později'),
    },
    {
      elementFactory: (props) =>
        AddToPlaylistDropDownFactory({ ...props, parentObjectId: videoId }),
    },
  ];

  const handleLikeClick = () => {
    // todo send like to api
    if (userStatsQuery?.data) {
      videoUserStatsMutation.mutateAsync(
        new UserVideoStats({
          ...userStatsQuery?.data,
          like: !userStatsQuery?.data?.like ?? true,
          dislike: false,
        }),
      );
    }
  };
  const handleDislikeClick = () => {
    if (userStatsQuery?.data) {
      videoUserStatsMutation.mutateAsync(
        new UserVideoStats({
          ...userStatsQuery?.data,
          like: false,
          dislike: !userStatsQuery?.data?.dislike ?? true,
        }),
      );
    }
  };
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
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
          color={userStatsQuery?.data?.like ? 'primary' : 'default'}
          onClick={handleLikeClick}
          disabled={!enabled}
        >
          <ThumbUpIcon />
        </IconButton>
        <Typography>{NumberToWords(likeCount)}</Typography>
      </Item>
      <Item>
        <IconButton
          color={userStatsQuery?.data?.dislike ? 'primary' : 'default'}
          onClick={handleDislikeClick}
          disabled={!enabled}
        >
          <ThumbDownIcon />
        </IconButton>
        <Typography>{NumberToWords(dislikeCount)}</Typography>
      </Item>
      <Item>
        <IconButton
          disabled={!enabled}
          onClick={handleShareClick}
          color={userStatsQuery?.data?.addedToPlaylist ? 'success' : 'default'}
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
