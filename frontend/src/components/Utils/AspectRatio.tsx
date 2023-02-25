// AspectRatio.tsx
import * as React from 'react';
import { Box, SxProps, Theme } from '@mui/system';

interface Props {
  children?: any;
  /**
   * The width divided by the height. This ratio can be passed in
   * using JavaScript division syntax. So, to get a 16:9 ratio,
   * simply pass `ratio={16/9}`.
   */
  ratio: number;
  sx?: SxProps<Theme>;
}
function AspectRatio({ children, ratio, sx }: Props) {
  return (
    <Box
      sx={{
        ...sx,
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: `calc((1 / ${ratio}) * 100%)`,
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
export default AspectRatio;
