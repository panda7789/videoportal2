import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import VideoCard from 'components/Thumbnail/VideoCard';
import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  Draggable,
  DraggableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import ReorderIcon from '@mui/icons-material/Reorder';
import { Video } from 'model/Video';

export interface Props {
  videos: Video[];
  draggable?: boolean;
  onDragEnd?(newVideos: Video[]): void;
}

export function VerticalList({ videos: videosProp, draggable, onDragEnd }: Props) {
  const [videos, setVideos] = useState<Video[]>(videosProp);

  const onDragEndLocal = (result: DropResult) => {
    const { destination, source } = result;
    if (destination?.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (!destination) {
      return;
    }
    const newList = Array.from(videos);
    const removed = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, removed[0]);

    setVideos(newList);
    if (onDragEnd) {
      onDragEnd(videos);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEndLocal}>
      <Droppable droppableId="playlistOrder" isDropDisabled={!draggable}>
        {(provided: DroppableProvided) => (
          <Grid
            container
            paddingLeft="calc(100% / 3.3)"
            item
            spacing={2}
            xs={12}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {videos.map((video, index) => {
              return (
                <Draggable
                  key={video.id}
                  draggableId={video.id}
                  index={index}
                  isDragDisabled={!draggable}
                >
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
                      {draggable && (
                        <Box {...draggableProvided.dragHandleProps} padding={2} display="flex">
                          <Box alignSelf="center">
                            <ReorderIcon />
                          </Box>
                        </Box>
                      )}
                      <VideoCard
                        key={video.id}
                        video={{ ...video }}
                        fullWidth
                        smallThumbnail
                        showDescription={false}
                      />
                    </Grid>
                  )}
                </Draggable>
              );
            })}
          </Grid>
        )}
      </Droppable>
    </DragDropContext>
  );
}
