import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import { Link } from 'react-router-dom';
import CustomChip from 'components/Chip/CustomChip';
import { VideoThumbnail } from 'model/Video';

function VideoCard(video: VideoThumbnail) {
  const { imageUrl, name, id } = video;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Grid item xs={12} md={3}>
      <Card variant="outlined">
        <CardActionArea component={Link} to={`/video/${id}`}>
          <CardMedia
            component="img"
            draggable={false}
            sx={{ aspectRatio: '16/9' }}
            image={imageUrl}
            alt={imageUrl}
          />
          <CardContent
            sx={{ display: 'flex', alignItems: 'center', height: 64, padding: '0 8px 0 8px' }}
          >
            <CustomChip text="tag1" color="#123" active />
            <Typography
              variant="subtitle2"
              component="div"
              width="100%"
              height={48}
              textOverflow="ellipsis"
              overflow="hidden"
              display="-webkit-box"
              ml={1}
              sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            >
              {name}
            </Typography>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default VideoCard;
