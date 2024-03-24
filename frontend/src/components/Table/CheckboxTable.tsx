import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EnhancedTable, { Attribute, TableDataBase } from './EnhancedTable';

export interface Props<T> {
  title: string;
  items: T[];
  attributes: Attribute<T>[];
  orderBy: keyof T;
  resultCallback: (selectedItems: string[]) => void;
  handleClose: () => void;
}

function CheckboxTable<T extends TableDataBase>({
  title,
  items,
  resultCallback,
  attributes,
  orderBy,
  handleClose,
}: Props<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const handleCheckboxChange = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) {
      return;
    }
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((selectedItem) => selectedItem !== item);
      }
      return [...prevSelectedItems, item];
    });
  };

  const handleOkClick = () => {
    resultCallback(selectedItems.map((item) => item.id));
    handleClose();
  };

  const handleCancelClick = () => {
    handleClose();
  };

  return (
    <Dialog open onClose={handleCancelClick} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent>
        <EnhancedTable
          attributes={attributes}
          rows={items}
          orderBy={orderBy}
          checkClick={(_, id) => handleCheckboxChange(id)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleOkClick}>
          Vybrat
        </Button>
        <Button onClick={handleCancelClick}>Zrušit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CheckboxTable;
