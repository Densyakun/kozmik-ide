import React, { useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import useUser from "../lib/useUser";
import fetchJson, { FetchError } from "../lib/fetchJson";

type Inputs = {
  password: string;
};

export default function Form({ }) {
  const { mutateUser } = useUser();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = useForm<Inputs>()

  const onSubmit = async (data: Inputs) => {
    try {
      mutateUser(
        await fetchJson("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
        false,
      );
    } catch (error) {
      if (error instanceof FetchError) {
        setError('password', { type: 'custom', message: error.data.message });
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  return (
    <>
      <h4>Login</h4>

      <Stack
        spacing={1}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => <TextField
            {...field}
            disabled={isSubmitting}
            fullWidth
            error={!!errors.password}
            label="Password"
            type="password"
            autoComplete="current-password"
            helperText={errors.password?.message}
          />}
          rules={{ required: true }}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
        >
          <i className='bi bi-plus'></i>
          Login
        </Button>
      </Stack>
    </>
  );
}
