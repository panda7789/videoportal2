import React, { useEffect, useRef, useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Alert,
  IconButton,
  MenuItem,
} from '@mui/material';
import { AxiosQuery } from 'api';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import {
  useMyUsergroupsQuery,
  useUserGroupsGETQuery,
  useUserGroupsPOSTMutation,
  useUserGroupsPUTMutation,
  useUsersAllQuery,
} from 'api/axios-client/Query';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ApiException, UserDTO, UserGroupDTO, UserGroupPostPutDTO } from 'api/axios-client';
import { Transfer } from 'antd';
import ClearIcon from '@mui/icons-material/Clear';
import { unionBy } from 'lodash';
import { Route } from 'routes/RouteNames';

export const loader = ({ params }: { params: any }) => {
  return AxiosQuery.Client.userGroupsGET(params.Id);
};

export interface Props {
  newGroup?: boolean;
}

export function UserGroupEdit({ newGroup = false }: Props) {
  let updateMutation: ReturnType<typeof useUserGroupsPUTMutation> | undefined;
  let postMutation: ReturnType<typeof useUserGroupsPOSTMutation> | undefined;
  const navigate = useNavigate();
  const user = useLoaderData() as UserGroupDTO;
  const [statusText, setStatusText] = useState<string>();
  const [targetUserKeys, setTargetUserKeys] = useState<string[]>(
    user?.users?.map((x) => x.id) ?? [],
  );
  const usersQuery = useUsersAllQuery();
  const [value, setValue] = useState<string | undefined>(user?.ownerGroupId ?? '');
  const ownerGroupQuery = useUserGroupsGETQuery(value ?? '');
  const groupsQuery = useMyUsergroupsQuery();
  const [groupEditable, setGroupEditable] = useState<boolean>(false);

  useEffect(() => {
    setGroupEditable(
      (newGroup || groupsQuery.data?.some((x) => x.id === user.ownerGroupId)) ?? false,
    );
  }, [user, groupsQuery.data]);
  if (newGroup) {
    postMutation = useUserGroupsPOSTMutation();
  }
  if (!newGroup) {
    if (user) {
      updateMutation = useUserGroupsPUTMutation(user.id);
    }
  }

  const nameRef = useRef<HTMLInputElement>(null);
  const ownerGroupInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event.currentTarget.name === 'Cancel') {
      return;
    }
    event.preventDefault();
    setStatusText(undefined);
    if (newGroup) {
      postMutation?.mutateAsync(
        new UserGroupPostPutDTO({
          name: nameRef.current!.value,
          userIds: targetUserKeys,
          ownerGroupId: ownerGroupInputRef.current!.value,
        }),
        {
          onSuccess: () => {
            setStatusText('Skupina byla úspěšně vytvořena');
            setTimeout(() => navigate(`/${Route.groups}/`), 300);
          },
          onError: (response) => {
            const error = response as ApiException;
            setStatusText(
              `Nepodařilo se vytvořit skupinu ${(error?.response as any)?.detail ?? ''}`,
            );
          },
        },
      );
    } else {
      const updatedGroup = new UserGroupPostPutDTO({
        name: nameRef.current!.value,
        userIds: targetUserKeys,
        ownerGroupId: ownerGroupInputRef.current!.value,
      });
      updateMutation?.mutateAsync(updatedGroup, {
        onSuccess: () => {
          setStatusText('Skupina byla úspěšně upravena');
          setTimeout(() => navigate(`/${Route.groups}/`), 300);
        },
        onError: (response) => {
          const error = response as ApiException;
          setStatusText(`Nepodařilo se upravit skupinu ${(error?.response as any)?.detail ?? ''}`);
        },
      });
    }
  };

  const handleRevertChanges = async () => {
    navigate(0);
  };

  const onKeyDown = (keyEvent: React.KeyboardEvent<HTMLFormElement>) => {
    if (keyEvent.code === 'Enter') {
      keyEvent.preventDefault();
    }
  };

  const filterOption = (inputValue: string, option: UserDTO) =>
    option.name.indexOf(inputValue) > -1 || option.email.indexOf(inputValue) > -1;

  const handleChange = (newTargetKeys: string[]) => {
    setTargetUserKeys(newTargetKeys);
  };

  return (
    <Box margin={4} component="form" onSubmit={handleSubmit} onKeyDown={onKeyDown}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Editace skupiny
        </Typography>
        <Box gap={2} display="flex">
          <Button
            variant="outlined"
            onClick={handleRevertChanges}
            startIcon={<RestoreIcon />}
            type="submit"
          >
            Zahodit změny
          </Button>
          <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
            Uložit
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {statusText && <Alert severity="info">{statusText}</Alert>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3} paddingTop={3}>
            <Grid item xs={12}>
              <TextField
                label="Jméno"
                defaultValue={user?.name}
                inputRef={nameRef}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} height="60vh">
              <Typography variant="subtitle1" gutterBottom>
                Uživatelé
              </Typography>
              <Transfer
                dataSource={usersQuery.data}
                showSearch
                filterOption={filterOption}
                onChange={handleChange}
                targetKeys={targetUserKeys}
                rowKey={(item) => item.id}
                style={{ width: '100%', height: '90%' }}
                listStyle={{ width: '100%', height: '90%' }}
                render={(item) => `${item.name}(${item.email})`}
                locale={{
                  titles: ['', 've skupině'],
                  itemsUnit: 'uživatelé',
                  itemUnit: 'uživatel',
                  notFoundContent: 'Kde nic tu nic',
                  searchPlaceholder: 'Hledat',
                  remove: 'Odebrat',
                  selectAll: 'Vybrat vše',
                  selectCurrent: 'Vybrat aktuální',
                  selectInvert: 'Otočit výběr',
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3} paddingTop={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="ownerGroupSelect"
                select
                required
                label="Vlastník skupiny"
                value={value}
                disabled={!groupEditable}
                inputRef={ownerGroupInputRef}
                onChange={(newValue) => {
                  setValue(newValue.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{
                        display: value && groupEditable ? undefined : 'none',
                        marginRight: '8px',
                      }}
                      onClick={() => setValue(undefined)}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
              >
                {unionBy(groupsQuery.data ?? [], [ownerGroupQuery.data ?? undefined], 'id')?.map(
                  (group) =>
                    group && (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ),
                )}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default { UserGroupEdit };
