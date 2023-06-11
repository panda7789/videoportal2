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
  actions: (DropDownMenuAction | DropDownMenuCustomAction)[];
  icon: JSX.Element;
  text?: string;
  sx?: SxProps<Theme>;
  enabled?: boolean;
}
export type DropDownMenuAction = {
  name: string;
  icon?: JSX.Element;
  onClick(): void;
};

export interface DropDownMenuCustomActionProps {
  onClose?(e: React.MouseEvent<any, MouseEvent> | undefined): void;
  onClick?(e: React.MouseEvent<any, MouseEvent>): void;
  parentObjectId?: string;
}

export type DropDownMenuCustomAction = {
  elementFactory(props: DropDownMenuCustomActionProps): JSX.Element;
};
export function IsDropDownMenuCustomAction(action: any): action is DropDownMenuCustomAction {
  return action.elementFactory !== undefined;
}

function DropDownMenu({ actions, sx, icon, text, enabled = true }: Props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [listenClickAway, setListenClickAway] = React.useState(true);
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
        disabled={!enabled}
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
              <ClickAwayListener onClickAway={listenClickAway ? handleClose : () => {}}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {actions.map((action) => {
                    if (IsDropDownMenuCustomAction(action)) {
                      return action.elementFactory({
                        onClose: (e) => {
                          if (e) {
                            e.preventDefault();
                          }
                          setOpen(false);
                          setListenClickAway(true);
                        },
                        onClick: (e: React.MouseEvent<any, MouseEvent>) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setListenClickAway(false);
                        },
                      });
                    }
                    const normalAction = action as DropDownMenuAction;
                    return (
                      <MenuItem
                        key={normalAction.name}
                        onClick={(event) => {
                          handleClose(event);
                          normalAction.onClick();
                        }}
                      >
                        {normalAction.icon && <ListItemIcon>{normalAction.icon}</ListItemIcon>}
                        <ListItemText>{normalAction.name}</ListItemText>
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
