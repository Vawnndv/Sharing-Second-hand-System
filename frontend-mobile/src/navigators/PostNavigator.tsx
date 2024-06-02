import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ItemDetailScreen from '../screens/home/ItemDetailScreen';
import PostScreen from '../screens/posts/PostScreen';
import ViewPostManagement from '../screens/posts/ViewPostManagement';
import EditPostScreen from '../screens/posts/EditPostScreen';
import MapSelectWarehouse from '../screens/map/MapSelectWarehouse';
import MapSelectWarehouseGive from '../screens/map/MapSelectWarehouseGive';
import MapSettingAddress from '../screens/map/MapSettingAddress';

const FavoritesNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="PostScreen" component={PostScreen} />
      <Stack.Screen name="ViewPostManagement" component={ViewPostManagement} />
      <Stack.Screen name="ItemDetailScreen" component={ItemDetailScreen} />
      <Stack.Screen name="EditPostScreen" component={EditPostScreen} />
      <Stack.Screen name="MapSelectWarehouseScreen" component={MapSelectWarehouse} />
      <Stack.Screen name="MapSelectWarehouseGiveScreen" component={MapSelectWarehouseGive} />
      <Stack.Screen name="MapSettingAddressScreen" component={MapSettingAddress}/>


    </Stack.Navigator>
  )
}

export default FavoritesNavigator