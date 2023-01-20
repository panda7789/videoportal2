/* eslint-disable jsx-a11y/media-has-caption */
import {
  Avatar,
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  IconButtonProps,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  TextField,
  Typography,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import React, { useContext, useEffect, useRef } from 'react';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getVideoById, UserVideoStats, Video, VideoThumbnail } from 'model/Video';
import theme from 'Theme';
import Comment, { CommentProps } from 'components/Comment/Comment';
import { Privileges, User } from 'model/User';
import LikeDislikeMenu from 'components/VideoDetail/LikeDislikeMenu';
import { useLoaderData } from 'react-router-dom';
import { NavigationContext } from './Root';
import 'videojs-hotkeys';
import VideoCard from 'components/VideoThumbnail/VideoCard';
import uuid from 'react-uuid';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const Users: User[] = [
  { id: '1', name: 'Lillie Myers', initials: 'LM', email: 'a@b.cz', rights: Privileges.user },
  { id: '2', name: 'Gene Rose', initials: 'GR', email: 'a@b.cz', rights: Privileges.user },
  { id: '3', name: 'Thomas Reese', initials: 'TR', email: 'a@b.cz', rights: Privileges.user },
  { id: '4', name: 'Tillie Guzman', initials: 'TG', email: 'a@b.cz', rights: Privileges.user },
];

const imgUrlGenerator = () => {
  return `https://picsum.photos/id/${
    // eslint-disable-next-line @typescript-eslint/dot-notation
    Math.floor(Math.random()*200)
  }/500/280`;
};

const RelatedVideos: VideoThumbnail[] = [];

for (let i = 0; i < 10; i+=1) {
  RelatedVideos.push({id: uuid(), imageUrl:imgUrlGenerator(), name: 'LM' });
}

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
  return getVideoById(params.videoId);
}

function VideoDetail() {
  const videoSrc = '/sampleVideo.mp4';
  const playerRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = React.useState(true);
  const commentInput = React.createRef<HTMLInputElement>();
  const [comments, setComments] = React.useState<CommentProps[]>([]);
  const video = useLoaderData() as Video;
  const context = useContext(NavigationContext);

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
  const addComment = (commentText: string | undefined) => {
    if (commentText) {
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
      setComments((prevState) => [comment, ...prevState]);
    }
  };

  useEffect(() => {
    let player: VideoJsPlayer;
    if (playerRef.current) {
      player = videojs(
        playerRef.current,
        {
          autoplay: false,
          muted: true,
          controls: true,
          aspectRatio: '9:16',
          responsive: true,
          fluid: true,
          plugins: {
            hotkeys: {
              volumeStep: 0.1,
              seekStep: 5,
              enableModifiersForNumbers: false,
            },
          },
        },
        () => {
          player.src(videoSrc);
        },
      );
    }

    return () => {
      player.dispose();
    };
  }, []);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      addComment(commentInput.current?.value);
    }
  };

  return (
    <Box width="100%">
      <video
        ref={playerRef}
        className="video-js vjs-16-9 vjs-big-play-centered"
        height="calc(100vh - 64px)"
        width="100%"
      />
      <Box display="flex" justifyContent="center" alignItems="center">
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
                  Nulla esse esse deserunt nulla dolor nisi irure aute aliquip cillum ea occaecat
                  amet. Tempor voluptate aliqua occaecat esse commodo laboris reprehenderit culpa
                  deserunt nisi ex. Mollit qui excepteur labore officia nulla excepteur elit non
                  enim et occaecat non.
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
          <Divider sx={{ marginTop: 2 }} />
          <Box mt={2}>
            <Typography variant="body1">Podobná videa</Typography>
            <Box display="flex" sx={{ maxWidth: '100%' }} mt={2} alignItems="center">
              <ImageList
                sx={{
                  gridAutoFlow: 'column',
                  gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr)) !important',
                  gridAutoColumns: 'minmax(280px, 1fr)',
                  gap: '8px',
                  width: '100%',
                  overflowX: 'scroll',
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': {
                    width: '10px',
                    height: '0.3em',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(to right, transparent 0%,#AAA 25%,#AAA 75%, transparent 100%)'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                  },
                }}
              >
                {RelatedVideos.map((_video) => (
                  <VideoCard key={_video.id} {..._video} />
                ))}
              </ImageList>
            </Box>
          </Box>
          <Divider sx={{ marginTop: 2 }} />
          <Box mt={1}>
            <Typography variant="body1">Komentáře ({comments.length})</Typography>
            <Box display="flex" mt={2}>
              <Avatar>LL</Avatar>
              <TextField
                sx={{ ml: 1 }}
                fullWidth
                id="outlined-basic"
                label=""
                variant="outlined"
                multiline
                inputRef={commentInput}
                onKeyUp={handleKeyPress}
              />
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
      </Box>
    </Box>
  );
}

export default VideoDetail;
