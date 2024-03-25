import { UserGroupDTO } from 'api/axios-client';
import { AddRemoveTable } from 'components/Table/AddRamoveTable';
import { Attribute } from 'components/Table/EnhancedTable';

export interface Props {
  allUsers?: UserGroupDTO[];
  groupUsers: string[];
  setGroupUsers: (newTargetKeys: string[]) => void;
}

export function GroupSelectTable({ allUsers, groupUsers, setGroupUsers }: Props) {
  const attributes: Attribute<UserGroupDTO>[] = [
    {
      id: 'name',
      label: 'Název',
    },
  ];

  return (
    <AddRemoveTable
      attributes={attributes}
      orderBy="name"
      selected={groupUsers}
      setSelected={setGroupUsers}
      all={allUsers}
    />
  );
}
