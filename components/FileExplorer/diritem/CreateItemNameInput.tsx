import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { DirItem } from '../../../pages/api/fs/dir';
import { resolve } from 'path';

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
  dirItems: DirItem[],
  setDirItems: (dirItems: DirItem[]) => void
}) {
  const {
    register,
    handleSubmit
  } = useForm<Inputs>();

  const onSubmit = async (input: Inputs) => {
    const path = encodeURIComponent(resolve(currentPath, input.path));

    if (isDirectory)
      fetch(`/api/fs/dir?path=${path}`, {
        method: 'POST'
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
        method: 'POST'
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
