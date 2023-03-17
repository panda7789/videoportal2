import * as React from 'react';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useEffect } from 'react';
import { GetRandomColor } from 'components/Utils/CoolColors';
import CustomChip from './CustomChip';

interface ChipData {
  key: string;
  label: string;
  active: boolean;
  bgColor: string;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipEditLine() {
  const [chipData, setChipData] = React.useState<readonly ChipData[]>([
    { key: '0', label: 'Angular', active: false, bgColor: GetRandomColor() },
    { key: '1', label: 'jQuery', active: false, bgColor: GetRandomColor() },
    { key: '2', label: 'Polymer', active: false, bgColor: GetRandomColor() },
    { key: '3', label: 'React', active: false, bgColor: GetRandomColor() },
    { key: '4', label: 'Vue.js', active: false, bgColor: GetRandomColor() },
  ]);
  const [addNewDialogOpen, setAddNewDialogOpen] = React.useState(false);
  const addNewInputRef = React.createRef<HTMLInputElement>();
  const [dialogError, setDialogError] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    if (addNewDialogOpen) {
      setTimeout(() => {
        addNewInputRef.current?.focus();
      }, 300);
    }
  }, [addNewDialogOpen]);

  const pleaseSort = (a: ChipData, b: ChipData) => {
    return Number(b.active) - Number(a.active) || a.label.localeCompare(b.label);
  };
  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) =>
      chips
        .map((chip) => (chip.key === chipToDelete.key ? { ...chip, active: false } : chip))
        .sort(pleaseSort),
    );
  };

  const handleClick = (clickedChip: ChipData) => () => {
    setChipData((chips) =>
      chips
        .map((chip) => (chip.key === clickedChip.key ? { ...chip, active: true } : chip))
        .sort(pleaseSort),
    );
  };

  const handleAddDialogOpen = () => {
    setAddNewDialogOpen(true);
  };
  const handleAddDialogClose = () => {
    setAddNewDialogOpen(false);
    setDialogError(undefined);
  };
  const handleAddDialogConfirm = () => {
    if (!addNewInputRef.current) {
      setDialogError('Nebyl nalezen textový input.');
      return;
    }
    if (addNewInputRef.current.value === '') {
      setDialogError('Nelze přidat prázdný tag.');
      return;
    }
    const newValue = addNewInputRef?.current?.value;
    if (chipData.filter((x) => x.label === newValue).length > 0) {
      setDialogError('Tag se stejným názvem již existuje.');
      return;
    }
    setDialogError(undefined);
    setChipData((chips) =>
      [
        ...chips,
        {
          active: true,
          key: newValue,
          label: newValue,
          bgColor: GetRandomColor(),
        },
      ].sort(pleaseSort),
    );
    setAddNewDialogOpen(false);
  };
  const onKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleAddDialogConfirm();
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {chipData.map((data) => {
        return (
          <ListItem key={data.key}>
            <CustomChip
              active={data.active}
              text={data.label}
              bgColor={data.bgColor}
              onDelete={data.active ? handleDelete(data) : undefined}
              onClick={data.active ? handleDelete(data) : handleClick(data)}
            />
          </ListItem>
        );
      })}
      <ListItem key="addButton">
        <CustomChip icon={<AddIcon />} onClick={handleAddDialogOpen} />
      </ListItem>
      <Dialog
        open={addNewDialogOpen}
        onClose={() => {
          setAddNewDialogOpen(false);
        }}
        disableEnforceFocus
      >
        <DialogTitle>Přidání nového tagu</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="newTagName"
            label="Název nového tagu"
            type="text"
            fullWidth
            variant="standard"
            error={!!dialogError}
            helperText={dialogError}
            inputRef={addNewInputRef}
            onKeyDown={onKeyDown}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Zrušit</Button>
          <Button onClick={handleAddDialogConfirm}>Přidat</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
