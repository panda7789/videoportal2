import React from 'react';
import { Avatar, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CommentDTO, UserDTO } from 'api/axios-client';
import Emoji from 'react-emoji-render';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCommentsDELETEMutation } from 'api/axios-client/Query';

export interface CommentProps {
  comment: CommentDTO;
  invalidate(): void;
  canEdit?: boolean;
}

function Comment({ comment, canEdit, invalidate }: CommentProps) {
  const deleteCommentMutation = useCommentsDELETEMutation(comment.id, {
    onSuccess: () => {
      invalidate();
    },
  });
  const handleDeleteClick = () => {
    deleteCommentMutation.mutate();
  };
  return (
    <Box display="flex" paddingTop={2} justifyContent="space-between">
      <Box display="flex">
        <Avatar>{comment.user.initials}</Avatar>
        <Box marginLeft={1} display="flex" flexDirection="column">
          <Typography variant="caption">{comment.user.name}</Typography>
          <Typography variant="body2">
            <Emoji text={comment.text} />
          </Typography>
        </Box>
      </Box>
      <Box>
        {canEdit && (
          <IconButton color="error" onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default Comment;
