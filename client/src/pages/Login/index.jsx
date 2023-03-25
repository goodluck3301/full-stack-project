import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slice/auth";

export const Login = () => {

  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setError,
    formState:{errors, isValid}
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'all'
  })

  const onSubmit = async (values) => {
   const data = await dispatch(fetchAuth(values))
   
      if(!data.payload)
        return alert("Չհաջողվեց մուտք գործել")

      if('token' in data.payload)
        window.localStorage.setItem('token', data.payload.token)
  }

  if(isAuth) {
    return <Navigate to='/'/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Մուտք գործել հաշիվ
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Էլ․ փոստ"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {required: 'Գրեք էլ․ փոստի հասցեն'})}
          fullWidth
        />
        <TextField 
          className={styles.field}
          label="Գաղտնաբառ"
          fullWidth 
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', {required: 'Գրեք գաղտնաբառը'})}
          />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Մուտք
        </Button>
      </form>
    </Paper>
  );
};
