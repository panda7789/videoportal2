import React, { useContext, useEffect } from 'react';
import { Box } from '@mui/system';
import EnhancedTable, { Attribute, ToolbarButton } from 'components/Table/EnhancedTable';
import { useTagsWithVideosQuery } from 'api/axios-client/Query';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tag } from 'api/axios-client';
import { AxiosQuery } from 'api';
import { UserContext } from 'routes/Root';

// eslint-disable-next-line import/prefer-default-export
export function TagEdit() {
  const arr = useTagsWithVideosQuery().data;
  const userContext = useContext(UserContext);

  const attributes: Attribute<Tag>[] = [
    {
      id: 'name',
      label: 'Název',
    },
    {
      id: 'videos',
      label: 'Počet použití',
      customFormat: (value: any) => {
        const videoArr = value as Array<any>;
        return videoArr.length.toString();
      },
    },
  ];

  const buttons: ToolbarButton[] = [];
  buttons.push({
    label: 'Smazat',
    icon: <DeleteIcon />,
    onClick: (selectedIDs: readonly string[]) => {
      console.log(selectedIDs);
      const selected = arr?.filter((x) => selectedIDs.includes(x.id));
      selected?.forEach((tag) => {
        AxiosQuery.Client.tagsDELETE(tag.id);
      });
    },
  });
  useEffect(() => {
    if (!userContext?.isLoading && !userContext?.user) throw new Error('Nejste přihlášení.');
  }, [userContext?.user, userContext?.isLoading]);

  return (
    <Box margin={4}>
      {arr && (
        <EnhancedTable
          attributes={attributes}
          rows={arr}
          orderBy="name"
          desc="asc"
          buttons={buttons}
        />
      )}
    </Box>
  );
}
