import { resolve } from 'path';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import { Dir } from '../../../pages/api/fs/dir';

type Inputs = {
  path: string;
};

export default function Form({
  currentPath,
  item,
  dirItems,
  setDirItems
}: {
  currentPath: string,
  item: Dir[number],
  dirItems: Dir,
  setDirItems: (dirItems: Dir) => void
}) {
  const {
    register,
    handleSubmit,
    setValue
  } = useForm<Inputs>();

  const onSubmit = async (input: Inputs) => {
    const oldPath = resolve(currentPath, item.name);
    const newPath = resolve(currentPath, input.path);

    fetch(`/api/fs/rename?path=${encodeURIComponent(oldPath)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPath: newPath })
    })
      .then((response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');

        const i = dirItems.findIndex(item => item.name === item.name)
        item.name = input.path
        dirItems.splice(i, 1, item)

        setDirItems([...dirItems])
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setValue("path", item.name);
  }, [item.name]);

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
          placeholder={`Enter the ${item.isDirectory ? "directory" : "file"} name`}
        />
      </Box>
    </>
  );
}
