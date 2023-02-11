import React, { PropsWithChildren, useRef } from 'react';
import { Button, ImageList } from '@mui/material';
import { Box } from '@mui/system';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


// eslint-disable-next-line import/prefer-default-export
export function InlineList({ children }: PropsWithChildren) {
  const videosListRef = useRef<HTMLUListElement>(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(true);

  const scrollByButton = () => {
    setTimeout(() => {
      if (!videosListRef.current) {
        return;
      }
      if (
        videosListRef.current.scrollLeft >
        videosListRef.current.scrollWidth - videosListRef.current.clientWidth - 300
      ) {
        setShowRight(false);
      } else {
        setShowRight(true);
      }
      if (videosListRef.current.scrollLeft < 300) {
        setShowLeft(false);
      } else {
        setShowLeft(true);
      }
    }, 300);
  };

  const scroll = (scrollRight: boolean) => {
    if (videosListRef.current) {
      if (scrollRight) {
        videosListRef.current.scrollLeft += videosListRef.current.scrollWidth / 2;
      } else {
        videosListRef.current.scrollLeft -= videosListRef.current.scrollWidth / 2;
      }
    }
  };

  return (
    <Box display="flex" sx={{ maxWidth: '100%' }} alignItems="center">
      {showLeft && (
        <Button
          sx={{
            position: 'absolute',
            zIndex: '100',
            height: '220px',
            '&:hover': {
              backgroundColor: '#ffffff99',
              '& .arrowButton': { backgroundColor: 'transparent' },
            },
          }}
          onClick={() => scroll(false)}
        >
          <ArrowBackIosIcon
            className="arrowButton"
            sx={{
              padding: '10px',
              backgroundColor: '#ffffff99',
              borderRadius: '50px',
              transition:
                'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',
            }}
          />
        </Button>
      )}
      <ImageList
        ref={videosListRef}
        onScroll={() => scrollByButton()}
        sx={{
          scrollBehavior: 'smooth',
          gridAutoFlow: 'column',
          gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr)) !important',
          gridAutoColumns: 'minmax(280px, 1fr)',
          gap: '8px !important',
          width: '100%',
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '10px',
            height: '0.3em',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background:
              'linear-gradient(to right, transparent 0%,#AAA 25%,#AAA 75%, transparent 100%)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {children}
        {showRight && (
          <Button
            sx={{
              position: 'absolute',
              zIndex: '100',
              right: '0',
              marginRight: '48px',
              height: '220px',
              '&:hover': {
                backgroundColor: '#ffffff99',
                '& .arrowButton': { backgroundColor: 'transparent' },
              },
            }}
            onClick={() => scroll(true)}
          >
            <ArrowForwardIosIcon
              className="arrowButton"
              sx={{
                padding: '10px',
                backgroundColor: '#ffffff99',
                borderRadius: '50px',
                transition:
                  'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;',
              }}
            />
          </Button>
        )}
      </ImageList>
    </Box>
  );
}


