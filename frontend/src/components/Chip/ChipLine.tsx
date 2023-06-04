import { Box, Grid, Skeleton } from '@mui/material';
import { Tag } from 'api/axios-client';
import CustomChip from './CustomChip';

interface Props {
  chipData: Tag[];
}

function ChipLine({ chipData }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
      }}
    >
      {chipData
        ? chipData.map((tag) => <CustomChip key={tag.id} text={tag.name} />)
        : [...Array(6)].map(() => (
            // eslint-disable-next-line react/jsx-key
            <Grid item xs={6} p={0.5}>
              <Skeleton variant="rounded" animation="wave" width="100%" height="32px" />
            </Grid>
          ))}
      <Box
        sx={{
          right: 0,
          width: '25px',
          height: '100%',
          position: 'absolute',
          background: 'linear-gradient(90deg, rgba(2,0,36,0) 0%, rgba(255,255,255,1) 75%)',
        }}
      />
    </Box>
  );
}
export default ChipLine;
