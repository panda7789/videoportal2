import { Box } from '@mui/material';
import { AxiosQuery } from 'api';
import { ChannelDTO } from 'api/axios-client';
import { AvatarButton } from 'components/Buttons/AvatarButton';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import { ApiPath } from 'components/Utils/APIUtils';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Route } from 'routes/RouteNames';

function AvatarButtonInRow({ id, name, avatarUrl }: ChannelDTO) {
  return <AvatarButton key={id} text={name} image={ApiPath(avatarUrl)} />;
}

export function MyChannels() {
  const arr = AxiosQuery.Query.useMyChannelsQuery().data;
  const navigate = useNavigate();

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
      {arr && (
        <EnhancedTable
          attributes={attributes}
          rows={arr}
          orderBy="name"
          desc="asc"
          staticButtons={staticButtons}
          rowClick={rowClick}
        />
      )}
    </Box>
  );
}
