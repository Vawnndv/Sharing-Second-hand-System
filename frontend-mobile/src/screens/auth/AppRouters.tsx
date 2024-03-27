import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthNavigator from '../../navigators/AuthNavigator';
import MainNavigator from '../../navigators/MainNavigator';
import { addAuth, authSelector } from '../../redux/reducers/authReducers';
import { LoadingModal } from '../../modals';
const AppRouters = () => {
  const {getItem} = useAsyncStorage('auth');
  const [isLoading, setIsLoading] = useState(true); 

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const res = await getItem();
    if (res) {
      dispatch(addAuth(JSON.parse(res)));
    }
    setIsLoading(false); 
  };

  if (isLoading) {
    return <LoadingModal visible={isLoading} />;
  }

  return (
    <>
      {auth.accessToken ? <MainNavigator roleID={auth.roleID} /> : <AuthNavigator />}
    </>
  )
}

export default AppRouters