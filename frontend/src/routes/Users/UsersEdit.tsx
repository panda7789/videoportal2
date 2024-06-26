import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { UserDTO } from 'api/axios-client';
import { useUsersAllQuery } from 'api/axios-client/Query';
import { AxiosQuery } from 'api';
import { Route } from 'routes/RouteNames';
import { Alert } from '@mui/material';
import { UserContext } from 'routes/Root';

// eslint-disable-next-line import/prefer-default-export
export function UsersEdit() {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState<string>();
  const usersQuery = useUsersAllQuery();
  const userContext = useContext(UserContext);

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
    color: 'error',
    onClick: (selectedIDs: readonly string[]) => {
      const promises = selectedIDs.map((x) => AxiosQuery.Client.usersDELETE(x));
      Promise.all(promises)
        .then(() => {
          setStatusText('Uživatelé byli úspěšně smazáni.');
          usersQuery.refetch();
        })
        .catch(() => {
          setStatusText('Uživatele se nepodařilo smazat.');
        });
    },
  });

  const staticButtons: ToolbarButton[] = [];
  staticButtons.push({
    label: 'Nový',
    icon: <AddIcon />,
    onClick: async () => {
      navigate({
        pathname: `/${Route.userEdit}`,
      });
    },
  });

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    navigate({
      pathname: `/${Route.userEdit}/${id}`,
    });
  };
  useEffect(() => {
    if (!userContext?.isLoading && !userContext?.user) throw new Error('Nejste přihlášení.');
  }, [userContext?.user, userContext?.isLoading]);

  return (
    <Box margin={4}>
      {statusText && (
        <Box mb={1}>
          <Alert severity="info">{statusText}</Alert>
        </Box>
      )}
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
