import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slice/auth';


export const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if(window.confirm('Դուք իսկապես ուզու՞մ եք դուրս գալ'))
      dispatch(logout())
      window.localStorage.removeItem('token')
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Arm Blog</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Ստեղծել հրապարակում</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Դուրս գալ
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Մուտք</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Ստեղծել հաշիվ</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};