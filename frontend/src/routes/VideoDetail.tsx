/* eslint-disable jsx-a11y/media-has-caption */
import {
  Avatar,
  Button,
  Collapse,
  Divider,
  IconButton,
  IconButtonProps,
  TextField,
  Typography,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import React, { useContext, useEffect, useRef } from 'react';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getVideoById, UserVideoStats, Video } from 'model/Video';
import theme from 'Theme';
import CustomChip from 'components/Chip/CustomChip';
import Comment, { CommentProps } from 'components/Comment/Comment';
import { Privileges, User } from 'model/User';
import LikeDislikeMenu from 'components/VideoDetail/LikeDislikeMenu';
import { useLoaderData } from 'react-router-dom';
import { NavigationContext } from './Root';

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
  return getVideoById(params.videoId);
}

function VideoDetail() {
  const videoSrc = '/sampleVideo.mp4';
  const playerRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = React.useState(false);
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
        { autoplay: false, muted: true, controls: true, aspectRatio: '9:16', responsive: true },
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

  return (
    <Box>
      <video ref={playerRef} className="video-js vjs-16-9" />
      <Box padding={2}>
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
            Nulla esse esse deserunt nulla dolor nisi irure aute aliquip cillum ea occaecat amet.
            Tempor voluptate aliqua occaecat esse commodo laboris reprehenderit culpa deserunt nisi
            ex. Mollit qui excepteur labore officia nulla excepteur elit non enim et occaecat non.
          </Typography>
        </Collapse>
        <LikeDislikeMenu
          {...videoUserStats}
          likeCount={video.likeCount}
          dislikeCount={video.dislikeCount}
        />
        <Divider sx={{ marginTop: 2 }} />
        <Box display="flex" mt={2} alignItems="center">
          <CustomChip color="#fff" text="tag1" active />
          <Typography paddingLeft={1}>tag1</Typography>
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
              label="Outlined"
              variant="outlined"
              inputRef={commentInput}
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
  );
}

export default VideoDetail;
