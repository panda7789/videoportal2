import { UserDTO } from 'api/axios-client';
import CheckboxTable from 'components/Table/CheckboxTable';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

export interface Props {
  allUsers?: UserDTO[];
  groupUsers: string[];
  setGroupUsers: (newTargetKeys: string[]) => void;
}

export function UserSelectTable({ allUsers, groupUsers, setGroupUsers }: Props) {
  const [userSelectOpen, setUserSelectOpen] = useState(false);

  const handleChange = (newTargetKeys: string[]) => {
    setGroupUsers(newTargetKeys);
  };
  const attributes: Attribute<UserDTO>[] = [
    {
      id: 'name',
      label: 'Název',
    },
    {
      id: 'email',
      label: 'Email',
    },
  ];
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
      label: 'Přidat uživatele do skupiny',
      onClick: () => setUserSelectOpen(true),
    },
  ];

  const handleUserSelect = (items: string[]) => {
    handleChange([...groupUsers, ...items]);
  };
  return (
    <>
      <EnhancedTable
        attributes={attributes}
        rows={allUsers?.filter((x) => groupUsers.findIndex((y) => y === x.id) !== -1) ?? []}
        orderBy="name"
        desc="desc"
        buttons={buttons}
        staticButtons={staticButtons}
        adjustWidth
      />
      {userSelectOpen && (
        <CheckboxTable
          title="Vyberte uživatele"
          attributes={attributes}
          handleClose={() => setUserSelectOpen(false)}
          items={allUsers?.filter((x) => groupUsers.findIndex((y) => y === x.id) === -1) ?? []}
          orderBy="email"
          resultCallback={handleUserSelect}
        />
      )}
    </>
  );
}
