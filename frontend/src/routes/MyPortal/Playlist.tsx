import React, { useState } from 'react';
import { Button, Grid, List, Typography } from '@mui/material';
import { Box } from '@mui/system';
import VideoCard from 'components/VideoThumbnail/VideoCard';
import { useLoaderData } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReorderIcon from '@mui/icons-material/Reorder';

import { getPlaylistById, Playlist as playlistModel } from 'model/Playlist';
import AspectRatio from 'components/Utils/AspectRatio';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd';

export async function loader({ params }: { params: any }) {
  return getPlaylistById(params);
}

export function Playlist() {
  const playlistFromLoader = useLoaderData() as playlistModel;
  const [playlist, setPlaylist] = useState<playlistModel>(playlistFromLoader);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (destination?.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (!destination) {
      return;
    }
    const newList = Array.from(playlist.videos);
    const removed = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed[0]);

    setPlaylist({ ...playlist, videos: newList });
  };

  return (
    <Box margin={4}>
      <Grid container xs={12} sx={{ alignItems: 'flex-start' }}>
        <Grid item xs={4} padding={2} position="fixed">
          <AspectRatio ratio={16 / 9}>
            <img width="100%" src={playlist.thumbnailUrl} />
          </AspectRatio>
          <Typography>{playlist.name}</Typography>
          <Box display="flex">
            <Button startIcon={<PlayArrowIcon />} variant="contained">
              Přehrát celý playlist
            </Button>
          </Box>
        </Grid>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="playlistOrder">
            {(provided: DroppableProvided) => (
              <Grid
                container
                paddingLeft="calc(100% / 3)"
                item
                spacing={2}
                xs={12}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {playlist.videos.map((video, index) => {
                  return (
                    <Draggable key={video.id} draggableId={video.id} index={index}>
                      {(draggableProvided: DraggableProvided) => (
                        <Grid
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          key={video.id}
                          item
                          xs={12}
                          display="flex"
                          alignItems="stretch"
                        >
                          <Box {...draggableProvided.dragHandleProps} padding={2} display="flex">
                            <Box alignSelf="center">
                              <ReorderIcon />
                            </Box>
                          </Box>
                          <VideoCard key={video.id} video={{ ...video }} large />
                        </Grid>
                      )}
                    </Draggable>
                  );
                })}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      </Grid>
    </Box>
  );
}
