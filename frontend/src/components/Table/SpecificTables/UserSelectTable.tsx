import { UserDTO } from 'api/axios-client';
import { AddRemoveTable } from 'components/Table/AddRamoveTable';
import { Attribute } from 'components/Table/EnhancedTable';

export interface Props {
  allUsers?: UserDTO[];
  groupUsers: string[];
  setGroupUsers: (newTargetKeys: string[]) => void;
}

export function UserSelectTable({ allUsers, groupUsers, setGroupUsers }: Props) {
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

  return (
    <AddRemoveTable
      attributes={attributes}
      orderBy="email"
      selected={groupUsers}
      setSelected={setGroupUsers}
      all={allUsers}
    />
  );
}
