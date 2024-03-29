import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import DrawerNavigator from './DrawerNavigator';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducers';
import MainTabNavigator from './collaborator/MainTabNavigator';
import SearchScreen from '../screens/search/SearchScreen';
import SearchResultScreen from '../screens/search/SearchResultScreen';

const MainNavigator = () => {

  const auth = useSelector(authSelector);
  let isAdmin;
  if (auth.roleID === 2){
    isAdmin = false
  }else{
    isAdmin = true
  }
    
  console.log(isAdmin)

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />

    </Stack.Navigator>
  )
}

export default MainNavigator