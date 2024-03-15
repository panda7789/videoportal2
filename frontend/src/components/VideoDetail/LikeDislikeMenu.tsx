import { Stack, IconButton, Typography, Box, styled, Snackbar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import React, { useState } from 'react';
import theme from 'Theme';
import { AxiosQuery } from 'api';
import {
  useAddRemoveWatchLaterMutation,
  useStatsQuery,
  useUserVideoStatsPUTMutation,
} from 'api/axios-client/Query';
import { UserVideoStatsDTO } from 'api/axios-client';
import { NumberToWords } from 'components/Utils/NumberUtils';
import { UseQueryResult } from '@tanstack/react-query';

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
  const [snackbarText, setSnackbarText] = useState<string | undefined>(undefined);
  const likeDislikeStatsQuery = useStatsQuery(videoId, { enabled: false });
  const videoUserStatsMutation = useUserVideoStatsPUTMutation(videoId, {
    onSuccess: () => {
      userStatsQuery?.refetch();
      likeDislikeStatsQuery.refetch();
    },
  });
  const addToWatchLaterMutation = useAddRemoveWatchLaterMutation(videoId, {
    onSuccess: () => {
      userStatsQuery?.refetch();
      setSnackbarOpen(true);
    },
  });

  const handleLikeClick = () => {
    if (userStatsQuery?.data) {
      videoUserStatsMutation.mutateAsync(
        new UserVideoStatsDTO({
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
        new UserVideoStatsDTO({
          ...userStatsQuery?.data,
          like: false,
          dislike: !userStatsQuery?.data?.dislike ?? true,
        }),
      );
    }
  };
  const handleWatchLaterClick = () => {
    if (userStatsQuery?.data) {
      setSnackbarText(
        `Video bylo ${
          !userStatsQuery?.data?.addedToPlaylist ? 'přidáno do' : 'odebráno z'
        } playlistu "Přehrát později"`,
      );
      addToWatchLaterMutation.mutate();
    }
  };
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarText('Odkaz byl zkopírován do schránky!');
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
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
        <Typography>
          {NumberToWords(likeDislikeStatsQuery?.data?.likeCount ?? likeCount)}
        </Typography>
      </Item>
      <Item>
        <IconButton
          color={userStatsQuery?.data?.dislike ? 'primary' : 'default'}
          onClick={handleDislikeClick}
          disabled={!enabled}
        >
          <ThumbDownIcon />
        </IconButton>
        <Typography>
          {NumberToWords(likeDislikeStatsQuery?.data?.dislikeCount ?? dislikeCount)}
        </Typography>
      </Item>
      <Item>
        <IconButton disabled={!enabled} onClick={handleShareClick}>
          <ShareIcon />
        </IconButton>
        <Typography>Sdílení</Typography>
      </Item>
      <Item>
        <IconButton
          disabled={!enabled}
          onClick={handleWatchLaterClick}
          color={userStatsQuery?.data?.addedToPlaylist ? 'primary' : 'default'}
        >
          <WatchLaterIcon />
        </IconButton>
        <Typography>Přehrát později</Typography>
      </Item>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={4000}
        message={snackbarText}
      />
    </Stack>
  );
}
export default LikeDislikeMenu;
