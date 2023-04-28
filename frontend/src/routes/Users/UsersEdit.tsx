import React from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { UserDTO } from 'api/axios-client';
import { useUsersAllQuery } from 'api/axios-client/Query';
import { AxiosQuery } from 'api';

// eslint-disable-next-line import/prefer-default-export
export function UsersEdit() {
  const navigate = useNavigate();
  const usersQuery = useUsersAllQuery();

  const attributes: Attribute<UserDTO>[] = [
    {
      id: 'name',
      label: 'Jméno',
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
    onClick: (selectedIDs: readonly string[]) => {
      const promises = selectedIDs.map((x) => AxiosQuery.Client.usersDELETE(x));
      Promise.all(promises).then(() => {
        usersQuery.refetch();
      });
    },
  });

  const staticButtons: ToolbarButton[] = [];
  staticButtons.push({
    label: 'Nový',
    icon: <AddIcon />,
    onClick: async () => {
      navigate({
        pathname: `/useredit/`,
      });
    },
  });

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    navigate({
      pathname: `/useredit/${id}`,
    });
  };

  return (
    <Box margin={4}>
      {usersQuery?.data && (
        <EnhancedTable
          attributes={attributes}
          rows={usersQuery.data}
          orderBy="id"
          buttons={buttons}
          staticButtons={staticButtons}
          rowClick={rowClick}
        />
      )}
    </Box>
  );
}
