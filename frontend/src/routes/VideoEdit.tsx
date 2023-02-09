import React from 'react';
import { Typography, Grid, TextField, Box, Button } from '@mui/material';
import { getVideoById, Video } from 'model/Video';
import { useLoaderData } from 'react-router-dom';
import AspectRatio from 'components/Utils/AspectRatio';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export async function loader({ params }: { params: any }) {
  return getVideoById(params);
}

export function VideoEdit() {
  const video = useLoaderData() as Video;

  const generateThumbnailFromVideo = () => {};

  return (
    <Box margin={4}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Editace videa
        </Typography>
        <Box gap={2} display="flex">
          <Button variant="outlined" startIcon={<RestoreIcon />}>
            Zahodit změny
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />}>
            Uložit
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3} paddingTop={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="nazev"
                name="nazev"
                label="Název"
                fullWidth
                defaultValue={video.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="popis"
                name="popis"
                label="Popis"
                fullWidth
                defaultValue={video.description}
                multiline
                minRows={7}
                maxRows={14}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>Náhledový obrázek:</Typography>
          <AspectRatio ratio={16 / 9}>
            <img width="100%" src={video.imageUrl} />
          </AspectRatio>
          <Box display="flex" justifyContent="center" gap={2} padding={2}>
            <Button component="label" startIcon={<FileUploadIcon />} variant="outlined">
              <input hidden accept="image/*" type="file" />
              Nahrát jiný
            </Button>
            <Button
              startIcon={<AutorenewIcon />}
              variant="outlined"
              onClick={generateThumbnailFromVideo}
            >
              Vygenerovat nový
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
