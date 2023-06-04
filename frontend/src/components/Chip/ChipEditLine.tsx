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
import { useEffect, useImperativeHandle } from 'react';
import { GetRandomColor } from 'components/Utils/CoolColors';
import CustomChip from './CustomChip';

export interface ChipData {
  key: string;
  label: string;
  active: boolean;
  bgColor: string;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export interface Props {
  chips?: ChipData[];
  addChipHandle(name: string): Promise<void>;
  deleteChipHandle?(id: string): void;
}

export type ChipLineFunctions = {
  getActiveChips: () => ChipData[];
};

// eslint-disable-next-line react/display-name
const ChipEditLine = React.forwardRef<ChipLineFunctions, Props>(
  ({ chips: chipsProp, addChipHandle, deleteChipHandle }: Props, ref) => {
    const pleaseSort = (a: ChipData, b: ChipData) => {
      return Number(b.active) - Number(a.active) || a.label.localeCompare(b.label);
    };
    const [chipData, setChipData] = React.useState<ChipData[]>(chipsProp?.sort(pleaseSort) ?? []);
    const [addNewDialogOpen, setAddNewDialogOpen] = React.useState(false);
    const addNewInputRef = React.createRef<HTMLInputElement>();
    const [dialogError, setDialogError] = React.useState<string | undefined>(undefined);

    useImperativeHandle(ref, () => ({
      getActiveChips() {
        return chipData.filter((x) => x.active);
      },
    }));

    useEffect(() => {
      // nasetujeme až přijde odpověd z api ale jen poprvé
      if (chipData.length === 0) {
        setChipData(chipsProp?.sort(pleaseSort) ?? []);
      }
    }, [chipsProp]);

    useEffect(() => {
      if (addNewDialogOpen) {
        setTimeout(() => {
          addNewInputRef.current?.focus();
        }, 300);
      }
    }, [addNewDialogOpen]);

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
    const handleAddDialogConfirm = async () => {
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
      try {
        await addChipHandle(newValue);
      } catch (error) {
        console.log(error);
        setAddNewDialogOpen(false);
        return;
      }

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
                link={false}
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
  },
);

export default ChipEditLine;
