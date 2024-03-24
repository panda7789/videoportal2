import React, { useContext, useEffect, useRef, useState } from 'react';
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
import ClearIcon from '@mui/icons-material/Clear';

import { unionBy } from 'lodash';
import { Route } from 'routes/RouteNames';
import { UserContext } from 'routes/Root';
import { UserSelectTable } from 'components/Table/UserSelectTable';

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
  const [groupUsers, setGroupUsers] = useState<string[]>(user?.users?.map((x) => x.id));
  const usersQuery = useUsersAllQuery();
  const [value, setValue] = useState<string | undefined>(user?.ownerGroupId ?? '');
  const ownerGroupQuery = useUserGroupsGETQuery(value ?? '');
  const groupsQuery = useMyUsergroupsQuery();
  const [groupEditable, setGroupEditable] = useState<boolean>(false);
  const userContext = useContext(UserContext);

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
          userIds: groupUsers,
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
        userIds: groupUsers,
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
  useEffect(() => {
    if (!userContext?.isLoading && !userContext?.user) throw new Error('Nejste přihlášení.');
  }, [userContext?.user, userContext?.isLoading]);

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
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Uživatelé
              </Typography>
              <UserSelectTable
                allUsers={usersQuery.data}
                groupUsers={groupUsers}
                setGroupUsers={setGroupUsers}
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
