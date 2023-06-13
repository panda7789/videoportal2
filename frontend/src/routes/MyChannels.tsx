import { Alert, Box, Typography } from '@mui/material';
import { AxiosQuery } from 'api';
import { ChannelDTO } from 'api/axios-client';
import { AvatarButton } from 'components/Buttons/AvatarButton';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import { ApiPath } from 'components/Utils/APIUtils';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import { Route } from 'routes/RouteNames';
import { useState } from 'react';

function AvatarButtonInRow({ id, name, avatarUrl }: ChannelDTO) {
  return <AvatarButton key={id} text={name} image={ApiPath(avatarUrl)} />;
}

export function MyChannels() {
  const myChannelsQuery = AxiosQuery.Query.useMyChannelsQuery();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState<string>();

  const attributes: Attribute<ChannelDTO>[] = [
    {
      id: 'avatarUrl',
      imageCustomElement: (row) => AvatarButtonInRow(row),
      label: 'Název',
    },
    {
      id: 'subscribersCount',
      label: 'Počet odběratelů',
    },
  ];

  const buttons: ToolbarButton[] = [
    {
      icon: <DeleteIcon />,
      label: 'Smazat',
      onClick(selectedIDs) {
        if (!selectedIDs?.length) {
          return;
        }
        setStatusText(undefined);
        const promises = selectedIDs.map((id) => AxiosQuery.Client.channelsDELETE(id));
        Promise.all(promises)
          .then(() => {
            myChannelsQuery.refetch();
            setStatusText('Kanál byl úspěšně smazán');
          })
          .catch(() => {
            setStatusText(
              'Kanál se nepodařilo smazat, zkontrolujte že jste z něj odebrali všechna videa',
            );
          });
      },
    },
  ];

  const staticButtons: ToolbarButton[] = [
    {
      icon: <AddIcon />,
      label: 'Vytvořit nový kanál',
      onClick: () => navigate(`/${Route.myChannels}/create`),
    },
  ];

  const rowClick = (event: React.MouseEvent<unknown>, id: string) => {
    navigate({
      pathname: `/${Route.myChannels}/${id}`,
    });
  };

  return (
    <Box m={4}>
      {statusText && (
        <Box mb={1}>
          <Alert severity="info">{statusText}</Alert>
        </Box>
      )}
      {myChannelsQuery?.data && (
        <EnhancedTable
          attributes={attributes}
          rows={myChannelsQuery?.data}
          orderBy="name"
          desc="asc"
          buttons={buttons}
          staticButtons={staticButtons}
          rowClick={rowClick}
        />
      )}
    </Box>
  );
}
