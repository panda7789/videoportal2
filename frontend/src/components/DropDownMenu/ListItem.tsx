import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export interface Props {
  text: string;
  icon: JSX.Element;
  onClick?(): void;
}

export function SimpleListItem({ text, icon, onClick }: Props) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
