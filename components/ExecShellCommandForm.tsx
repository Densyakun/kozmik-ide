import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type Inputs = {
  command: string;
};

export default function Form({ }) {
  const [cwd, setCwd] = useState("");
  const [stdout, setStdout] = useState("");

  fetch("/api/cwd", { method: 'GET' })
    .then((response: Response) => {
      if (!response.ok) throw new Error('Network response was not OK');

      return response.text();
    })
    .then(data => {
      setCwd(data);
    })
    .catch((error) => {
      console.error(error);
    });

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    fetch("/api/exec", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(data),
    })
      .then((response: Response) => {
        if (!response.ok) throw new Error('Network response was not OK');

        return response.text();
      })
      .then(data => {
        setStdout(data);
      })
      .catch((error) => {
        console.error(error);
        setError('command', { type: 'custom', message: error });
      });
  }

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h6">
          Exec shell command
        </Typography>
        <Typography variant="subtitle1">
          {cwd}
        </Typography>
      </Stack>

      <Stack
        spacing={1}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="command"
          control={control}
          render={({ field }) => <TextField
            {...field}
            disabled={isSubmitting}
            fullWidth
            error={!!errors.command}
            label="Command"
            helperText={errors.command?.message}
          />}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
        >
          Exec
        </Button>

        <Typography>
          {stdout}
        </Typography>
      </Stack>
    </>
  );
}
