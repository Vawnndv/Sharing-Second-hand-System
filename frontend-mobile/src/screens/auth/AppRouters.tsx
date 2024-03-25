import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthNavigator from '../../navigators/AuthNavigator';
import MainNavigator from '../../navigators/MainNavigator';
import { addAuth, authSelector } from '../../redux/reducers/authReducers';

const AppRouters = () => {
  const {getItem} = useAsyncStorage('auth');

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const res = await getItem();

    res && dispatch(addAuth(JSON.parse(res)));
  };

  return (
    <>
      {auth.accessToken ? <MainNavigator /> : <AuthNavigator />}
    </>
  )
}

export default AppRouters