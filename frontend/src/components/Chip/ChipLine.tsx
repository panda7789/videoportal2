import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { SxProps } from '@mui/system';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import theme from 'Theme';
import CustomChip, { CustomChipInterface } from './CustomChip';

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
function ScrollArrow({ direction, onClickProp, sx }: ScrollArrowInterface) {
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
        mb: 2,
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
}

interface ChipLineInterface {
  chipData: CustomChipInterface[];
  setActiveChipCallback?: (chipName: string | null) => void;
}

function ChipLine({ setActiveChipCallback, chipData }: ChipLineInterface) {
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

  useEffect(() => {
    if (setActiveChipCallback) {
      if (activeChip === 0) {
        setActiveChipCallback(null);
        return;
      }
      setActiveChipCallback(chipData[activeChip - 1].text);
    }
  }, [activeChip]);

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
        paddingBottom: 1,
      }}
      paddingLeft={{ xs: 1, md: 0 }}
      onScroll={scrollHandle}
    >
      {showScroll && scrollState !== ScrollState.FullyLeft && (
        <ScrollArrow
          direction={ScrollDirection.Left}
          onClickProp={() => scrollButtonHandle(ScrollDirection.Left)}
          sx={{ left: 0 }}
        />
      )}
      <CustomChip
        key="Vše"
        text="Vše"
        color="#6D6D6D"
        onClick={() => setActiveChip(0)}
        active={activeChip === 0}
      />
      {chipData.map((chip, index) => {
        const active = index + 1 === activeChip;
        return (
          <CustomChip
            key={chip.text}
            text={chip.text}
            color={chip.color}
            onClick={() => setActiveChip(index + 1)}
            active={active}
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
}
export default ChipLine;
