import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { fetchRegister } from '../../redux/slice/auth';
import { selectIsAuth } from '../../redux/slice/auth';
import styles from './Login.module.scss';

export const Registration = () => {

  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState:{errors, isValid}
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      avatarUrl: ''
    },
    mode: 'all'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values))
    
       if(!data.payload)
         return alert("Չհաջողվեց գրանցվել")
 
       if('token' in data.payload)
         window.localStorage.setItem('token', data.payload.token)
   }
 
   if(isAuth) {
     return <Navigate to='/'/>
   }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Ստեղծել Հաշիվ
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
          className={styles.field}
          label="Անուն Ազգանուն"
          fullWidth
          type="text"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', {required: 'Գրեք անուն ազգանուն'})}
        />
        <TextField
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {required: 'Գրեք էլ․ փոստի հասցեն'})}
          className={styles.field} 
          label="Էլ․ փոստ" 
          fullWidth />
        <TextField type="password"
            error={Boolean(errors.password?.message)}
            helperText={errors.password?.message}
            className={styles.field}
            label="Գաղտնաբառ"
            {...register('password', {required: 'Գրեք գաղտնաբառը'})}
            fullWidth />
        <Button disabled={!isValid} size="large" type="submit" variant="contained" fullWidth>
          Գրանցվել
        </Button>
      </form>
    </Paper>
  );
};
