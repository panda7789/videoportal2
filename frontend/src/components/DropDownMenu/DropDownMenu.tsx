import React from 'react';
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  IconButton,
  Box,
  SxProps,
  Theme,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

export interface Props {
  actions: DropDownMenuAction[];
  icon: JSX.Element;
  text?: string;
  sx?: SxProps<Theme>;
}
export interface DropDownMenuAction {
  name: string;
  icon?: JSX.Element;
  onClick(): void;
}

function DropDownMenu({ actions, sx, icon, text }: Props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event | React.SyntheticEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Box sx={sx}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleToggle}
        ref={anchorRef}
      >
        {icon}
      </IconButton>
      {text && <Typography>{text}</Typography>}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-start' ? 'left bottom' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {actions.map((action) => {
                    return (
                      <MenuItem
                        key={action.name}
                        onClick={(event) => {
                          handleClose(event);
                          action.onClick();
                        }}
                      >
                        {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
                        <ListItemText>{action.name}</ListItemText>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}

export default DropDownMenu;
