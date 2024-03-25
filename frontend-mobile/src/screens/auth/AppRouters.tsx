import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MainNavigator from '../../navigators/MainNavigator';

const AppRouters = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <MainNavigator />
    </>
  )
}

export default AppRouters