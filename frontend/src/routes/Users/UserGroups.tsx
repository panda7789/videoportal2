import React, { useState } from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { UserGroupDTO } from 'api/axios-client';
import { useMyUsergroupsQuery, useUserGroupsAllQuery } from 'api/axios-client/Query';
import { AxiosQuery } from 'api';
import { Route } from 'routes/RouteNames';
import { Alert } from '@mui/material';

// eslint-disable-next-line import/prefer-default-export
export function UserGroups() {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState<string>();
  const groupsQuery = useMyUsergroupsQuery();

  const attributes: Attribute<UserGroupDTO>[] = [
    {
      id: 'name',
      label: 'Jméno',
    },
  ];

  const buttons: ToolbarButton[] = [];
  buttons.push({
    label: 'Smazat',
    icon: <DeleteIcon />,
    color: 'error',
    onClick: (selectedIDs: readonly string[]) => {
      const promises = selectedIDs.map((x) => AxiosQuery.Client.userGroupsDELETE(x));
      Promise.all(promises)
        .then(() => {
          setStatusText('Skupiny byly úspěšně smazány.');
          groupsQuery.refetch();
        })
        .catch(() => {
          setStatusText('Skupiny se nepodařilo smazat.');
        });
    },
  });

  const staticButtons: ToolbarButton[] = [];
  staticButtons.push({
    label: 'Nový',
    icon: <AddIcon />,
    onClick: async () => {
      navigate({
        pathname: `/${Route.groups}/create`,
      });
    },
  });

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    navigate({
      pathname: `/${Route.groups}/${id}`,
    });
  };

  return (
    <Box margin={4}>
      {statusText && (
        <Box mb={1}>
          <Alert severity="info">{statusText}</Alert>
        </Box>
      )}
      {groupsQuery?.data && (
        <EnhancedTable
          attributes={attributes}
          rows={groupsQuery.data}
          orderBy="id"
          buttons={buttons}
          staticButtons={staticButtons}
          rowClick={rowClick}
        />
      )}
    </Box>
  );
}
