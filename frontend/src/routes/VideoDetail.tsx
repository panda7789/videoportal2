/* eslint-disable jsx-a11y/media-has-caption */
import {
  Avatar,
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  IconButtonProps,
  TextField,
  Typography,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import React, { useContext, useEffect } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getVideoById } from 'model/Video';
import theme from 'Theme';
import Comment from 'components/Comment/Comment';
import LikeDislikeMenu from 'components/VideoDetail/LikeDislikeMenu';
import { Link, useLoaderData, useSearchParams } from 'react-router-dom';
import { VideoInlineList } from 'components/InlineList/VideoInlineList';
import { VideoPlayer } from 'components/VideoDetail/VideoPlayer';
import ScrollToTop from 'components/Utils/ScrollOnTop';
import { ExpandedPlaylistInlineList } from 'components/InlineList/PlaylistInlineList';
import { TailSpin } from 'react-loader-spinner';
import ChipLine from 'components/Chip/ChipLine';
import { CommentPostDTO, PlaylistDTO, VideoDTO as Video } from 'api/axios-client';
import { ApiPath } from 'components/Utils/APIUtils';
import { ChannelAvatar } from 'components/Avatar/ChannelAvatar';
import { AxiosQuery } from 'api';
import {
  useCommentsAllQuery,
  useCommentsPOSTMutation,
  useUserVideoStatsGETQuery,
  useWatchedMutation,
} from 'api/axios-client/Query';
import { Route } from 'routes/RouteNames';
import { NavigationContext, UserContext } from './Root';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export async function loader({ params }: { params: any }) {
  return getVideoById(params.videoId);
}

function VideoDetail() {
  const [expanded, setExpanded] = React.useState(false);
  const commentInput = React.createRef<HTMLInputElement>();
  const video = useLoaderData() as Video;
  const context = useContext(NavigationContext);
  const [searchParams] = useSearchParams();
  const [playlist, setPlaylist] = React.useState<PlaylistDTO | undefined>(undefined);
  const [playlistIndex, setPlaylistIndex] = React.useState<number | undefined>(undefined);
  const [commentTimeout, setCommentTimeout] = React.useState(false);
  const userContext = useContext(UserContext);
  const relatedVideosQuery = AxiosQuery.Query.useRelatedVideosQuery({ id: video.id });
  const commentsQuery = useCommentsAllQuery({ videoId: video.id }, { refetchOnWindowFocus: false });
  const userVideoStatsMutation = useWatchedMutation(video.id);
  const userVideoStatsQuery = useUserVideoStatsGETQuery({ videoId: video.id });
  const commentMutation = useCommentsPOSTMutation({
    onSuccess: () => {
      commentsQuery.refetch();
      if (commentInput?.current) {
        commentInput.current.value = '';
      }
      setCommentTimeout(true);
      setTimeout(() => {
        setCommentTimeout(false);
      }, 10 * 1000);
    },
  });

  useEffect(() => {
    const playlistId = searchParams.get('playlist');
    const index = searchParams.get('index') ?? '0';
    (async () => {
      if (playlistId) {
        setPlaylist(await AxiosQuery.Client.playlistsGET(playlistId));
        setPlaylistIndex(parseInt(index, 10));
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    context?.setOpen(false);
  }, []);

  const addComment = async (commentText: string | undefined) => {
    if (commentText) {
      commentMutation.mutate(
        new CommentPostDTO({
          text: commentText,
          videoId: video.id,
        }),
      );
    }
  };

  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',

    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const userWatchedHandle = (sec: number) => {
    userVideoStatsMutation.mutate(sec);
  };

  useEffect(() => {
    ScrollToTop();
  }, [video]);

  useEffect(() => {
    userVideoStatsQuery.refetch();
  }, [userContext]);

  return (
    <Grid container>
      <Grid item xs={12}>
        {video?.dataUrl ? (
          <VideoPlayer
            videoSrc={ApiPath(video.dataUrl)!}
            triggerWatched={userWatchedHandle}
            watchedTimeSec={
              !userVideoStatsQuery?.isRefetchError
                ? userVideoStatsQuery?.data?.timeWatchedSec ?? 0
                : 0
            }
          />
        ) : (
          <Typography variant="h1">Video nenalezeno.</Typography>
        )}
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" pb={8}>
        <Box width="95%" mt={2}>
          <Grid container spacing={2} minHeight={170}>
            <Grid item xs={12} md={8}>
              <Box display="flex" onClick={handleExpandClick}>
                <Typography variant="subtitle1" lineHeight="24px" width="100%">
                  {video.name}
                </Typography>
                <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                  <ExpandMoreIcon />
                </ExpandMore>
              </Box>
              <Typography variant="caption">Popis:</Typography>
              <Typography
                onClick={handleExpandClick}
                variant="subtitle1"
                sx={{
                  '-webkit-line-clamp': '2',
                  ...(expanded && {
                    '-webkit-line-clamp': 'unset',
                  }),
                  display: '-webkit-box',
                  '-webkit-box-orient': 'vertical',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'break-spaces',
                }}
              >
                {video.description}
              </Typography>
              {(video?.tags?.length ?? 0) > 0 && (
                <>
                  <Typography variant="caption">Tagy:</Typography>
                  <Grid container gap={0.5} pt={1} sx={{ position: 'relative' }}>
                    <ChipLine chipData={video.tags!} />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={4}
              direction="column"
              justifyContent="flex-start"
              height={170}
            >
              <Grid item xs={6} height={65} width="100%">
                <LikeDislikeMenu
                  videoId={video.id}
                  likeCount={video.likeCount}
                  dislikeCount={video.dislikeCount}
                  enabled={!!userContext?.user}
                  userStatsQuery={userVideoStatsQuery}
                />
              </Grid>
              <Grid item xs={6} height={65} width="100%">
                <Box
                  display="flex"
                  component={Link}
                  to={`/${Route.channel}/${video.channelId}`}
                  mt={2}
                  ml="10px"
                  mr={2}
                  alignItems="center"
                >
                  <ChannelAvatar
                    imageSrc={ApiPath(video.channelAvatarUrl)}
                    avatarInitials={video.channelName}
                    large
                  />
                  <Typography paddingLeft={1}>{video.channelName}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {playlist && (
            <>
              <Divider sx={{ marginTop: 2 }} />
              <Box mt={2}>
                <ExpandedPlaylistInlineList
                  playlist={playlist}
                  currentlyPlaying={playlistIndex}
                  showPlayAllButton={false}
                  editable
                />
              </Box>
            </>
          )}
          <Divider sx={{ marginTop: 2 }} />
          {relatedVideosQuery?.data && (
            <Box mt={2}>
              <Typography variant="body1">Podobná videa</Typography>
              <Box mt={2}>
                <VideoInlineList videos={relatedVideosQuery.data} showChannel />
              </Box>
            </Box>
          )}
          <Divider sx={{ marginTop: 2 }} />
          <Box mt={1}>
            <Typography variant="body1">Komentáře ({commentsQuery?.data?.length ?? 0})</Typography>

            <Box display="flex" mt={2}>
              <Avatar>{userContext?.user?.initials}</Avatar>
              {commentsQuery.isLoading ? (
                <TailSpin
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              ) : (
                <TextField
                  sx={{ ml: 1 }}
                  fullWidth
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  multiline
                  disabled={!userContext?.user}
                  placeholder={
                    !userContext?.user ? 'Pro přidání komentáře se nejprve přihlaste.' : ''
                  }
                  inputRef={commentInput}
                />
              )}
              <Button
                variant="text"
                disabled={!userContext?.user || commentTimeout}
                onClick={() => addComment(commentInput.current?.value)}
              >
                Odeslat
              </Button>
            </Box>
            {commentsQuery?.data?.map((comment) => (
              <Comment
                key={comment.created + comment.user.id}
                comment={comment}
                canEdit={userContext?.user?.roles.administrator}
                invalidate={commentsQuery.refetch}
              />
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default VideoDetail;
