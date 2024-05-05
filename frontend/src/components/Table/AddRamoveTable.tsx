import CheckboxTable from 'components/Table/CheckboxTable';
import EnhancedTable, {
  Attribute,
  TableDataBase,
  ToolbarButton,
} from 'components/Table/EnhancedTable';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { Box } from '@mui/system';

export interface Props<T> {
  all?: T[];
  selected: string[];
  setSelected: (newTargetKeys: string[]) => void;
  attributes: Attribute<T>[];
  orderBy: keyof T;
}

export function AddRemoveTable<T extends TableDataBase>({
  all: allUsers,
  selected: groupUsers,
  setSelected: setGroupUsers,
  attributes,
  orderBy,
}: Props<T>) {
  const [userSelectOpen, setUserSelectOpen] = useState(false);

  const handleChange = (newTargetKeys: string[]) => {
    setGroupUsers(newTargetKeys);
  };
  const buttons: ToolbarButton[] = [];
  buttons.push({
    label: 'Smazat',
    icon: <DeleteIcon />,
    color: 'error',
    onClick: (selectedIDs: readonly string[]) => {
      handleChange(groupUsers.filter((x) => !selectedIDs.includes(x)));
    },
  });

  const staticButtons: ToolbarButton[] = [
    {
      icon: <AddIcon />,
      label: 'Přidat',
      onClick: () => setUserSelectOpen(true),
    },
  ];

  const handleUserSelect = (items: string[]) => {
    handleChange([...groupUsers, ...items]);
  };
  return (
    <Box>
      <EnhancedTable
        attributes={attributes}
        rows={allUsers?.filter((x) => groupUsers?.findIndex((y) => y === x.id) !== -1) ?? []}
        orderBy={orderBy}
        desc="desc"
        buttons={buttons}
        staticButtons={staticButtons}
        adjustWidth
        hidePagination
      />
      {userSelectOpen && (
        <CheckboxTable
          title="Vyberte uživatele"
          attributes={attributes}
          handleClose={() => setUserSelectOpen(false)}
          items={allUsers?.filter((x) => groupUsers?.findIndex((y) => y === x.id) === -1) ?? []}
          orderBy={orderBy}
          resultCallback={handleUserSelect}
        />
      )}
    </Box>
  );
}
