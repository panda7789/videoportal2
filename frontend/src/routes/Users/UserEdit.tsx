import React, { useRef } from 'react';
import {
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { AxiosQuery } from 'api';
import { User, UserRoles } from 'model/User';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import { useRegisterMutation, useUsersPUTMutation } from 'api/axios-client/Query';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { RegisterDTO } from 'api/axios-client';

export const loader = ({ params }: { params: any }) => {
  return AxiosQuery.Client.usersGET(params.Id);
};

export interface Props {
  newUser?: boolean;
}

export function UserEditor({ newUser = false }: Props) {
  let updateUserMutation: ReturnType<typeof useUsersPUTMutation> | undefined;
  let registerMutation: ReturnType<typeof useRegisterMutation> | undefined;
  const navigate = useNavigate();
  const user = useLoaderData() as User;
  if (newUser) {
    registerMutation = useRegisterMutation();
  }
  if (!newUser) {
    if (user) {
      updateUserMutation = useUsersPUTMutation(user.id);
    }
  }

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const adminRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event.currentTarget.name === 'Cancel') {
      return;
    }
    event.preventDefault();
    if (newUser) {
      registerMutation?.mutateAsync(
        new RegisterDTO({
          email: emailRef.current!.value,
          name: nameRef.current!.value,
          password: passwordRef.current!.value,
        }),
        {
          onSuccess: (result) => {},
          onError: (error: any) => {},
        },
      );
    } else {
      const updatedUser = new User({
        id: user?.id,
        name: nameRef.current!.value,
        email: emailRef.current!.value,
        initials: '',
        roles: new UserRoles({
          administrator: adminRef.current!.checked,
          videoEditor: editorRef.current!.checked,
          user: viewerRef.current!.checked,
        }),
      });
      updateUserMutation?.mutate(updatedUser);
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

  return (
    <Box margin={4} component="form" onSubmit={handleSubmit} onKeyDown={onKeyDown}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Editace uživatele
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
              <TextField
                label="Email"
                type="email"
                defaultValue={user?.email}
                inputRef={emailRef}
                required
                fullWidth
              />
            </Grid>
            {newUser && (
              <Grid item xs={12}>
                <TextField
                  label="Heslo"
                  required
                  inputRef={passwordRef}
                  type="password"
                  fullWidth
                />
              </Grid>
            )}
            {!newUser && (
              <Grid item xs={12}>
                <FormGroup
                  sx={{
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    paddingLeft: '14px',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={user?.roles?.administrator}
                        inputRef={adminRef}
                        name="admin"
                      />
                    }
                    label="Administrator"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={user?.roles?.videoEditor}
                        inputRef={editorRef}
                        name="editor"
                      />
                    }
                    label="Video editor"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={user?.roles?.user}
                        inputRef={viewerRef}
                        name="viewer"
                      />
                    }
                    label="Uživatel"
                  />
                </FormGroup>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserEditor;
