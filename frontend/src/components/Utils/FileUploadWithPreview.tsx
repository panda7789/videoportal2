import { Button, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AspectRatio from 'components/Utils/AspectRatio';

export interface Props {
  uploadedFile: File | undefined;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  existingImageUrl?: string;
}

export function FileUploadWithPreview({ uploadedFile, setUploadedFile, existingImageUrl }: Props) {
  const [imagePreview, setImagePreview] = useState<string>();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target?.files?.length === 1) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDelete = () => {
    setUploadedFile(undefined);
  };

  useEffect(() => {
    if (uploadedFile) {
      setImagePreview(URL.createObjectURL(uploadedFile));
    } else {
      setImagePreview(undefined);
    }
  }, [uploadedFile]);

  return (
    <>
      <AspectRatio ratio={16 / 9}>
        <img
          width="100%"
          style={{ maxHeight: '100%', objectFit: 'contain' }}
          src={imagePreview ?? existingImageUrl}
        />
      </AspectRatio>
      <Box display="flex" justifyContent="center" gap={2} padding={2}>
        <Button component="label" startIcon={<FileUploadIcon />} variant="outlined">
          <input hidden accept="image/*" type="file" onChange={handleChange} />
          Nahrát
        </Button>
        <IconButton onClick={handleDelete} color="error" >
          <DeleteIcon />
        </IconButton>
      </Box>
    </>
  );
}
