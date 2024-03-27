import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import DrawerNavigator from './DrawerNavigator';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducers';
import MainTabNavigator from './collaborator/MainTabNavigator';

const MainNavigator = () => {

  const auth = useSelector(authSelector);
  let isAdmin;
  if (auth.roleID === 1){
    isAdmin = false
  }else{
    isAdmin = true
  }
    
  console.log(isAdmin)

  const Stack = createNativeStackNavigator();


  return isAdmin ? (<>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} />
    </Stack.Navigator>
  </>) : (
    
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={DrawerNavigator} />
    </Stack.Navigator>
  )
}

export default MainNavigator