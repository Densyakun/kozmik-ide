import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { Dir } from '../../pages/api/fs/dir';

type Inputs = {
  path: string;
};

export default function Form({
  currentPath,
  isDirectory,
  dirItems,
  setDirItems
}: {
  currentPath: string,
  isDirectory: boolean,
  dirItems: Dir,
  setDirItems: (dirItems: Dir) => void
}) {
  const {
    register,
    handleSubmit
  } = useForm<Inputs>();

  const onSubmit = async (input: Inputs) => {
    const path = encodeURIComponent(currentPath);

    if (isDirectory)
      fetch(`/api/fs/dir?path=${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: input.path })
      })
        .then((response: Response) => {
          if (!response.ok) throw new Error('Network response was not OK');

          setDirItems([...dirItems, {
            name: input.path,
            isDirectory: isDirectory,
            isSymbolicLink: false
          }]);
        })
        .catch((error) => {
          console.error(error);
        });
    else
      fetch(`/api/fs/file?path=${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: input.path })
      })
        .then((response: Response) => {
          if (!response.ok) throw new Error('Network response was not OK');

          setDirItems([...dirItems, {
            name: input.path,
            isDirectory: isDirectory,
            isSymbolicLink: false
          }]);
        })
        .catch((error) => {
          console.error(error);
        });
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: 1 }}
      >
        <InputBase
          {...register("path")}
          fullWidth
          sx={{ flex: 1 }}
          placeholder={`Enter the name of the ${isDirectory ? "directory" : "file"} to be created`}
        />
      </Box>
    </>
  );
}
