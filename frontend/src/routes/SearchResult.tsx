import React from 'react';
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import VideoCard from "components/VideoThumbnail/VideoCard";
import { VideoThumbnail } from 'model/Video';
import { useLoaderData } from 'react-router-dom';

function SearchResult() {
  // loader
  // use loader
  const arr = useLoaderData() as VideoThumbnail[];


  return (
    <Box>
      <Grid container spacing={1}>
        {arr.map((video) => {
          return <VideoCard key={video.id} {...video} />;
        })}
      </Grid>
    </Box>
  );

  // foreach search result
  // videoCard below each other
}
export default SearchResult;