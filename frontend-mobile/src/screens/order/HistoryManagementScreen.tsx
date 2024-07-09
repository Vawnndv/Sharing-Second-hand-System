import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import GiveHistoryScreen from '../../components/OrderManagement/GiveHistoryScreen';
import ReceiveHistoryScreen from '../../components/OrderManagement/ReceiveHistoryScreen';
import TabComponent from '../../components/TabComponent';
import { filterValue } from '../home/components/ItemTabComponent';
import { category } from '../../constants/appCategories';

const SubTabs = createMaterialTopTabNavigator();

function HistoryManagementScreen() {
  const [filterUserPostValue, setFilterUserPostValue] = useState<filterValue>({
    distance: -1,
    time: -1,
    category: category,
    sort: "Mới nhất"
  });

  const [filterWarehouseValue, setFilterWarehouseValue] = useState<filterValue>({
    distance: -1,
    time: -1,
    category: category,
    sort: "Mới nhất"
  });
  
  return (
    <SubTabs.Navigator 
      tabBar={props => (
        <TabComponent
        {...props}
        filterUserPostValue={filterUserPostValue}
        filterWarehouseValue={filterWarehouseValue}
        setFilterUserPostValue={setFilterUserPostValue}
        setFilterWarehouseValue={setFilterWarehouseValue}
        />
      )}
    >
       <SubTabs.Screen name="Đồ cho">
        {(props) => <GiveHistoryScreen {...props} filterValue={filterUserPostValue} />}
      </SubTabs.Screen>
      <SubTabs.Screen name="Đồ nhận">
        {(props) => <ReceiveHistoryScreen {...props} filterValue={filterWarehouseValue} />}
      </SubTabs.Screen>
    </SubTabs.Navigator>
  );
}

export default HistoryManagementScreen;
