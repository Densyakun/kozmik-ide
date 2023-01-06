import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

type Inputs = {
  currentDirectoryPath: string;
};

export default function Form({ defaultValue, setCurrentPath }: { defaultValue: string, setCurrentPath: (newCurrentPath: string) => void }) {
  const {
    control,
    handleSubmit,
    setValue
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    setCurrentPath(data.currentDirectoryPath);
  };

  useEffect(() => {
    setValue("currentDirectoryPath", defaultValue);
  }, [defaultValue]);

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: 1 }}
      >
        <Controller
          name="currentDirectoryPath"
          control={control}
          render={({ field }) => <TextField
            {...field}
            fullWidth
            label="Current directory path"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            inputProps={{ sx: { fontSize: "1.25rem" } }}
          />}
          rules={{ required: true }}
        />
      </Box>
    </>
  );
}
