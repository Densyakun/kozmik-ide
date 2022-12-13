import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { Dir } from '../pages/api/dir';

type Inputs = {
  path: string;
};

export default function Form({ handleMakeDirItem, isDirectory }: { handleMakeDirItem: (newItem: Dir[number]) => void, isDirectory: boolean }) {
  const {
    register,
    handleSubmit
  } = useForm<Inputs>();

  const onSubmit = async (input: Inputs) => {
    const path = encodeURIComponent(input.path);

    if (isDirectory)
      fetch("/api/dir", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: path })
      })
        .then((response: any) => {
          if (!response.ok) throw new Error('Network response was not OK');

          handleMakeDirItem({
            name: path,
            isDirectory: isDirectory,
            isSymbolicLink: false
          });
        })
        .catch((error) => {
          console.error(error);
        });
    else
      fetch("/api/file", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: path })
      })
        .then((response: any) => {
          if (!response.ok) throw new Error('Network response was not OK');

          handleMakeDirItem({
            name: path,
            isDirectory: isDirectory,
            isSymbolicLink: false
          });
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
