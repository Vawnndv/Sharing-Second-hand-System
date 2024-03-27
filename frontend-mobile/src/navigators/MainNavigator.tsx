import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import DrawerNavigator from './DrawerNavigator';

const MainNavigator = ({roleID} : any) => {

  let isAdmin;
  if (roleID === 2){
    isAdmin = false
  }else
    isAdmin = true

  const Stack = createNativeStackNavigator();

  return (
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