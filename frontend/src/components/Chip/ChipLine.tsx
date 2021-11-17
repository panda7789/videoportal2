import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Chip, IconButton, useMediaQuery } from '@mui/material';
import { SxProps } from '@mui/system';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import theme, { CustomColors } from '../../Theme';

enum ScrollState {
  FullyLeft = 0,
  NotFullyLeft = 1,
  FullyRight = 2,
}

enum ScrollDirection {
  Left = 0,
  Right = 1,
}
interface ScrollArrowInterface {
  direction: ScrollDirection;
  onClickProp: React.MouseEventHandler<HTMLButtonElement>;
  sx?: SxProps;
}
const ScrollArrow = ({ direction, onClickProp, sx }: ScrollArrowInterface) => {
  return (
    <Box
      width="4"
      height="5"
      sx={{
        ...sx,
        position: 'sticky',
        zIndex: 1,
        backgroundColor: '#FFF',
        boxShadow: '0px 0px 10px 10px #ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconButton
        sx={{
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClickProp}
      >
        {direction === ScrollDirection.Left ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
};

const ChipLine = () => {
  const [activeChip, setActiveChip] = useState(0);
  const [scrollState, setScrollState] = useState(ScrollState.FullyLeft);
  const [showScroll, setShowScroll] = useState(false);
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const lineRef = useRef<HTMLElement>(null);

  const scrollHandle = useCallback(() => {
    const lineRefCurrent = lineRef.current;
    if (lineRefCurrent) {
      if (isDesktop && lineRefCurrent.scrollWidth > lineRefCurrent.clientWidth) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
        return;
      }
      if (lineRefCurrent.scrollLeft === 0) {
        // mam jeste kam scrollovat
        setScrollState(ScrollState.FullyLeft);
        return;
      }
      if (lineRefCurrent.scrollLeft === lineRefCurrent.scrollWidth - lineRefCurrent.clientWidth) {
        setScrollState(ScrollState.FullyRight);
        return;
      }
      setScrollState(ScrollState.NotFullyLeft);
    }
  }, [lineRef, isDesktop]);

  useEffect(() => {
    scrollHandle();
  });

  const scrollButtonHandle = (direction: ScrollDirection) => {
    const lineRefCurrent = lineRef.current;
    if (lineRefCurrent) {
      if (direction === ScrollDirection.Left) {
        lineRefCurrent.scrollLeft -= lineRefCurrent.clientWidth;
        return;
      }
      if (direction === ScrollDirection.Right) {
        lineRefCurrent.scrollLeft += lineRefCurrent.clientWidth;
      }
    }
  };
  // todo user subjects
  const subjects = [
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
    'YPS2',
    'YAML2',
    'YMAT',
    'YMAT2',
  ];
  subjects.unshift('VŠE');

  return (
    <Box
      ref={lineRef}
      sx={{
        display: 'flex',
        gap: 1,
        zIndex: -1,
        overflowX: 'scroll',
        '&::-webkit-scrollbar': {
          height: '0px', // hides the scrollbar but still can scroll
        },
      }}
      onScroll={scrollHandle}
    >
      {showScroll && scrollState !== ScrollState.FullyLeft && (
        <ScrollArrow
          direction={ScrollDirection.Left}
          onClickProp={() => scrollButtonHandle(ScrollDirection.Left)}
          sx={{ left: 0 }}
        />
      )}
      {subjects.map((subject, index) => {
        const actualColor = CustomColors[index % CustomColors.length]?.hexValue ?? 'primary';
        return (
          <Chip
            key={subject}
            label={subject}
            variant="outlined"
            onClick={() => setActiveChip(index)}
            className={index === activeChip ? 'chip--selected' : 'chip'}
            sx={{
              color: actualColor,
              borderColor: actualColor,
              '&.chip--selected': {
                color: '#FFF',
                backgroundColor: actualColor,
              },
              '&.chip--selected:hover': {
                backgroundColor: actualColor,
              },
            }}
          />
        );
      })}
      {showScroll && scrollState !== ScrollState.FullyRight && (
        <ScrollArrow
          direction={ScrollDirection.Right}
          onClickProp={() => scrollButtonHandle(ScrollDirection.Right)}
          sx={{ right: 0 }}
        />
      )}
    </Box>
  );
};
export default ChipLine;
