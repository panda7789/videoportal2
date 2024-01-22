import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import VideoCard from 'components/Thumbnail/VideoCard';
import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  DroppableProvided,
  Draggable,
  DraggableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import ReorderIcon from '@mui/icons-material/Reorder';
import { Video } from 'model/Video';
import { StrictModeDroppable } from 'components/Utils/StrictModeDroppable';
import {
  DropDownMenuAction,
  DropDownMenuCustomAction,
  IsDropDownMenuCustomAction,
} from 'components/DropDownMenu/DropDownMenu';

export interface Props {
  videos: Video[];
  draggable?: boolean;
  onDragEnd?(newVideos: Video[]): void;
  emptyText?: string;
  urlParamsGenerator?: (video: Video, index: number) => string;
  showActions?: boolean;
  dropdownActions?: (DropDownMenuAction | DropDownMenuCustomAction)[];
}

export function VerticalList({
  videos: videosProp,
  draggable,
  onDragEnd,
  emptyText,
  urlParamsGenerator,
  showActions,
  dropdownActions,
}: Props) {
  const [videos, setVideos] = useState<Video[]>(videosProp);

  useEffect(() => {
    setVideos(videosProp);
  }, [videosProp]);
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
      onDragEnd(newList);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEndLocal}>
      <StrictModeDroppable droppableId="playlistOrder" isDropDisabled={!draggable}>
        {(provided: DroppableProvided) => (
          <Grid
            container
            item
            spacing={2}
            xs={12}
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ border: '1px solid #30BCED', borderRadius: '10px' }}
            minHeight="100%"
            alignContent="flex-start"
          >
            {videos.length > 0 ? (
              videos.map((video, index) => {
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
                        maxHeight="125px"
                        p={1}
                        pl={-1}
                        pr={2}
                      >
                        {draggable && (
                          <Box
                            {...draggableProvided.dragHandleProps}
                            padding={1}
                            pl={0}
                            display="flex"
                          >
                            <Box alignSelf="center">
                              <ReorderIcon />
                            </Box>
                          </Box>
                        )}
                        <VideoCard
                          key={video.id}
                          video={video}
                          fullWidth
                          smallThumbnail
                          showTags
                          showChannel
                          showDescription={false}
                          showActions={showActions ?? false}
                          dropdownActions={dropdownActions?.map((x) =>
                            !IsDropDownMenuCustomAction(x) && x?.onClickWithId
                              ? { ...x, onClick: () => x.onClickWithId?.(video.id) }
                              : x,
                          )}
                          urlParams={urlParamsGenerator ? urlParamsGenerator(video, index) : ''}
                        />
                      </Grid>
                    )}
                  </Draggable>
                );
              })
            ) : (
              <Box
                height="75vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                width="100%"
              >
                <Typography variant="body1">Seznam neobsahuje žádný záznam 😥</Typography>
                {emptyText && <Typography variant="caption">{emptyText}</Typography>}
              </Box>
            )}
          </Grid>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
