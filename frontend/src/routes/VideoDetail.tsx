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
import { getVideoById, UserVideoStats, Video } from 'model/Video';
import theme from 'Theme';
import Comment, { CommentProps } from 'components/Comment/Comment';
import { Privileges, User } from 'model/User';
import LikeDislikeMenu from 'components/VideoDetail/LikeDislikeMenu';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { VideoInlineList } from 'components/InlineList/VideoInlineList';
import { VideoPlayer } from 'components/VideoDetail/VideoPlayer';
import ScrollToTop from 'components/Utils/ScrollOnTop';
import { NavigationContext } from './Root';
import { getPlaylistById, PlaylistModel } from 'model/Playlist';
import { PlaylistDetail } from './Playlist';
import { VerticalList } from 'components/VerticalList/VerticalList';
import {
  ExpandedPlaylistInlineList,
  PlaylistInlineList,
} from 'components/InlineList/PlaylistInlineList';
import { TailSpin } from 'react-loader-spinner';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const Users: User[] = [
  { id: '1', name: 'Lillie Myers', initials: 'LM', email: 'a@b.cz', rights: Privileges.user },
  { id: '2', name: 'Gene Rose', initials: 'GR', email: 'a@b.cz', rights: Privileges.user },
  { id: '3', name: 'Thomas Reese', initials: 'TR', email: 'a@b.cz', rights: Privileges.user },
  { id: '4', name: 'Tillie Guzman', initials: 'TG', email: 'a@b.cz', rights: Privileges.user },
];

const Texts: string[] = [
  'Voluptate ullamco fugiat elit amet eu. 👍😁',
  'Irure amet. 😍🤩 Ullamco amet occaecat officia dolore velit ad dolor.😀😂',
  'Ex non aute ut cillum minim Lorem consectetur veniam officia culpa tempor dolore aute.',
  'Fugiat duis nisi magna reprehenderit 👍 velit incididunt eu irure enim deserunt nisi.',
  'Sit occaecat aute ea esse commodo ex ad consequat mollit consectetur do consequat ad et.😀😂',
  'Sit ut veniam et dolor do nulla irure amet quis laboris 👩‍🎨 culpa id voluptate.',
  'Aliquip laboris fugiat excepteur duis minim labore cillum commodo.😫',
];

const videoUserStats: UserVideoStats = {
  like: true,
};

export async function loader({ params }: { params: any }) {
  return getVideoById(params);
}

function VideoDetail() {
  const [expanded, setExpanded] = React.useState(true);
  const commentInput = React.createRef<HTMLInputElement>();
  const [comments, setComments] = React.useState<CommentProps[]>([]);
  const [relatedVideos, setRelatedVideos] = React.useState<Video[]>([]);
  const video = useLoaderData() as Video;
  const context = useContext(NavigationContext);
  const [searchParams] = useSearchParams();
  const [playlist, setPlaylist] = React.useState<PlaylistModel | undefined>(undefined);
  const [playlistIndex, setPlaylistIndex] = React.useState<number | undefined>(undefined);
  const [commentsLoading, setCommentsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    console.log(searchParams.toString());
    const playlistId = searchParams.get('playlist');
    const index = searchParams.get('index') ?? '0';
    (async () => {
      if (playlistId) {
        setPlaylist(await getPlaylistById(playlistId));
        setPlaylistIndex(parseInt(index, 10));
      }
    })();
  }, [searchParams]);

  useEffect(() => {
    context?.setOpen(false);
  }, []);

  useEffect(() => {
    const commentsApi: CommentProps[] = [];
    [...Array.from(Array(10).keys())].forEach(() => {
      commentsApi.push({
        user: Users[Math.floor(Math.random() * Users.length)],
        text: Texts[Math.floor(Math.random() * Texts.length)],
      });
    });
    setComments(commentsApi);
  }, []);
  const addComment = async (commentText: string | undefined) => {
    if (commentText) {
      setCommentsLoading(true);
      const comment: CommentProps = {
        text: commentText,
        user: {
          id: '0',
          name: 'Lukáš Linhart',
          initials: 'LL',
          email: 'a@b.cz',
          rights: Privileges.user,
        }, // TODO Current user
      };
      await Promise.all([
        // eslint-disable-next-line no-promise-executor-return
        new Promise((r) => setTimeout(r, 500)),
      ]);
      setComments((prevState) => [comment, ...prevState]);
      if (commentInput && commentInput.current) {
        commentInput.current.value = '';
      }
      setCommentsLoading(false);
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

  useEffect(() => {
    (async () => {
      const localRelatedVideos: Video[] = [];
      for (let i = 0; i < 10; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        localRelatedVideos.push(await getVideoById('1234'));
      }
      setRelatedVideos(localRelatedVideos);
    })();
  }, []);

  useEffect(() => {
    ScrollToTop();
  }, [video]);

  return (
    <Grid container xs={12}>
      <Grid item xs={12}>
        <VideoPlayer videoSrc="/sampleVideo.mp4" />
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
        <Box width="95%" mt={2}>
          <Grid container spacing={2} minHeight={170}>
            <Grid item xs={8}>
              <Box display="flex" onClick={handleExpandClick}>
                <Typography variant="subtitle1" lineHeight="24px" width="100%">
                  {video.name}
                </Typography>
                <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                  <ExpandMoreIcon />
                </ExpandMore>
              </Box>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Typography variant="caption">Popis:</Typography>
                <Typography variant="subtitle1" paddingBottom="16px">
                  {video.description}
                </Typography>
              </Collapse>
            </Grid>
            <Grid container item xs={4} direction="column" justifyContent="flex-start" height={170}>
              <Grid item xs={6} height={65} width="100%">
                <LikeDislikeMenu
                  {...videoUserStats}
                  likeCount={video.likeCount}
                  dislikeCount={video.dislikeCount}
                />
              </Grid>
              <Grid item xs={6} height={65} width="100%">
                <Box display="flex" mt={2} ml="10px" mr={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      border: '0.1px solid lightgray',
                      padding: '4px',
                      img: { objectFit: 'fill', borderRadius: '50%' },
                    }}
                    src="/upol.png"
                  />
                  <Typography paddingLeft={1}>Univerzita Palackého v Olomouci</Typography>
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
          <Box mt={2}>
            <Typography variant="body1">Podobná videa</Typography>
            <Box mt={2}>
              <VideoInlineList videos={relatedVideos} />
            </Box>
          </Box>

          <Divider sx={{ marginTop: 2 }} />
          <Box mt={1}>
            <Typography variant="body1">Komentáře ({comments.length})</Typography>
            <Box display="flex" mt={2}>
              <Avatar>LL</Avatar>
              {commentsLoading ? (
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
                  inputRef={commentInput}
                />
              )}
              <Button variant="text" onClick={() => addComment(commentInput.current?.value)}>
                Odeslat
              </Button>
            </Box>
            {comments.map((comment, i) => (
              <Comment
                // eslint-disable-next-line react/no-array-index-key
                key={comment.text + i + comment.user.id}
                text={comment.text}
                user={comment.user}
              />
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default VideoDetail;
