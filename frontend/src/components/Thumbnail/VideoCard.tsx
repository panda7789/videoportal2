/* eslint-disable no-nested-ternary */
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import React, { useContext } from 'react';
import { Video, videoUrl } from 'model/Video';
import DropDownMenu, {
  DropDownMenuAction,
  DropDownMenuCustomAction,
} from 'components/DropDownMenu/DropDownMenu';
import AspectRatio from 'components/Utils/AspectRatio';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import { VideoPlayer } from 'components/VideoDetail/VideoPlayer';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import theme from 'Theme';
import ChipLine from 'components/Chip/ChipLine';
import { FsPath } from 'components/Utils/APIUtils';
import { TimeSpanToReadableFormat, TimestampToAgoWords } from 'components/Utils/NumberUtils';
import { ChannelAvatar } from 'components/Avatar/ChannelAvatar';
import { Route } from 'routes/RouteNames';
import { SnackbarContext, UserContext } from 'routes/Root';
import { AxiosQuery } from 'api';

interface Props {
  video: Video;
  fullWidth?: boolean;
  smallThumbnail?: boolean;
  showDescription?: boolean;
  showChannel?: boolean;
  showAvatar?: boolean;
  showStats?: boolean;
  showTags?: boolean;
  showActions?: boolean;
  withPlayer?: boolean;
  currentlyPlaying?: boolean;
  urlParams?: string;
  dropdownActions?: (DropDownMenuAction | DropDownMenuCustomAction)[];
}

function VideoCard({
  video,
  fullWidth,
  smallThumbnail,
  showDescription,
  showAvatar,
  showChannel,
  showStats,
  showTags,
  showActions,
  withPlayer,
  currentlyPlaying,
  urlParams,
  dropdownActions,
}: Props) {
  const { imageUrl, name, id, duration, description } = video;
  const notPermittedVideo = video?.isEmpty === true;
  const userContext = useContext(UserContext);
  const snackBarContext = useContext(SnackbarContext);

  const defaultDropdownActions: (DropDownMenuAction | DropDownMenuCustomAction)[] = [
    {
      name: 'Přehrát později',
      onClick: () => {
        AxiosQuery.Client.addRemoveWatchLater(video.id)
          .then((value) => {
            snackBarContext?.showText(
              `Video bylo úspěšně ${
                value === true ? 'přidáno do' : 'odebráno z'
              } playlistu Přehrát později`,
            );
          })
          .catch((error) => {
            snackBarContext?.showText(
              `Video se nepodařilo přidat/odebrat do/z playlistu Přehrát později - ${error}`,
            );
          });
      },
      icon: <WatchLaterIcon />,
    },
  ];

  return (
    <Grid container style={{ textDecoration: 'none', height: '100%' }}>
      <Card
        variant="outlined"
        sx={{
          ...(fullWidth && {
            display: 'flex',
          }),
          ...(!fullWidth && {
            height: '100%',
          }),
          width: '100%',
        }}
      >
        <Grid
          item
          sx={{
            aspectRatio: '16 / 9',
            position: 'relative',
            ...(fullWidth && { display: 'flex' }),
          }}
        >
          {withPlayer ? (
            <VideoPlayer videoSrc="/sampleVideo.mp4" autoplay muted />
          ) : (
            <Box component={Link} to={`${videoUrl(video)}${urlParams || ''}`} width="100%">
              <AspectRatio ratio={16 / 9} sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  draggable={false}
                  image={notPermittedVideo ? '/notPermitted.webp' : FsPath(imageUrl)}
                  alt={imageUrl}
                  sx={{
                    maxHeight: '100%',
                    width: '100%',
                    objectFit: 'cover',
                    ...(currentlyPlaying && {
                      boxSizing: 'border-box',
                      border: `3px solid ${theme.palette.primary.main}}`,
                    }),
                  }}
                />
                {currentlyPlaying && (
                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      display: 'flex',

                      color: `${theme.palette.primary.main}`,
                      height: '100%',
                      width: '100%',
                      top: 0,
                      left: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <SkipNextIcon
                      fontSize="large"
                      sx={{ backgroundColor: '#ffffffdd', padding: '0.25em', borderRadius: '50%' }}
                    />
                  </Box>
                )}
              </AspectRatio>
              <Typography
                variant="caption"
                padding={0.5}
                sx={{
                  height: 16,
                  color: 'white',
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#333333bb',
                  borderRadius: '10%',
                }}
              >
                {TimeSpanToReadableFormat(duration)}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid
          item
          display="flex"
          flex={1}
          component={Link}
          to={`/${Route.video}/${id}`}
          style={{ textDecoration: 'none' }}
        >
          <CardContent
            sx={{
              display: 'grid',
              paddingBottom: '4px !important',
              width: 'calc(100% - 8px)', // 8px => left padding
              padding: 1,
              paddingRight: 0,
              paddingTop: 0,
              gridTemplateColumns: '100%',
              ...(!fullWidth && {
                minHeight: 64,
              }),
              ...(fullWidth && {
                paddingRight: 0,
              }),
              ...(smallThumbnail && {
                maxHeight: '100%',
                paddingBottom: '4px !important',
              }),
            }}
          >
            <Box>
              <Box display="flex" position="relative">
                <Typography
                  variant="subtitle2"
                  component="div"
                  width="100%"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  display="-webkit-box"
                  pt={1}
                  sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {notPermittedVideo ? 'Nedostatečná oprávnění' : name}
                </Typography>
                {(showActions ?? true) && userContext?.user && (
                  <DropDownMenu
                    actions={dropdownActions ?? defaultDropdownActions}
                    icon={<MoreVertIcon />}
                    sx={{
                      right: 0,
                      ...(!fullWidth && {
                        position: 'absolute',
                      }),
                    }}
                  />
                )}
              </Box>
              {(showDescription ?? false) && (
                <Typography
                  variant="caption"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {description}
                </Typography>
              )}
              {(showStats ?? true) && (
                <Box pb="4px">
                  <Typography variant="caption">{video.views} zhlédnutí • </Typography>
                  <Typography variant="caption">
                    {notPermittedVideo ? '' : TimestampToAgoWords(video.uploadTimestamp)}
                  </Typography>
                </Box>
              )}
              {(showTags ?? true) && video.tags && video.tags?.length > 0 && (
                <ChipLine chipData={video.tags} smaller={showChannel ?? false} />
              )}
            </Box>
            {(showChannel ?? false) && (
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  textDecoration: 'none',
                  color: 'unset',
                  borderRadius: '15px',
                  cursor: 'pointer',
                }}
              >
                {(showAvatar ?? true) && <ChannelAvatar avatarInitials={video.owner.initials} />}
                <Typography paddingLeft={1} variant={smallThumbnail ? 'caption' : 'body1'}>
                  {video.owner.name}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Grid>
      </Card>
    </Grid>
  );
}

export default VideoCard;
