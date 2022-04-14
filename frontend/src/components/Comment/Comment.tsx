import React from 'react';
import { Avatar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { UserLite } from '../../model/User';

export interface CommentProps {
  user: UserLite;
  text: string;
}

const Comment = ({ user, text }: CommentProps) => {
  return (
    <Box display="flex" paddingTop={2}>
      <Avatar>{user.initials}</Avatar>
      <Box marginLeft={1} display="flex" flexDirection="column">
        <Typography variant="caption">{user.name}</Typography>
        <Typography variant="body2">{text}</Typography>
      </Box>
    </Box>
  );
};

export default Comment;
