import React, { useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import GiveOrderScreen from '../../components/OrderManagement/GiveOrderScreen';
import ReceiveOrderScreen from '../../components/OrderManagement/ReceiveOrderScreen';
import { RowComponent, SectionComponent } from '../../components';
import FilterOrder from '../../components/OrderManagement/FilterOrder';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { filterValue } from '../home/components/ItemTabComponent';
import { category } from '../../constants/appCategories';
import TabComponent from '../../components/TabComponent';

const SubTabs = createMaterialTopTabNavigator();

function OrderManagementScreen() {
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
        {(props) => <GiveOrderScreen {...props} filterValue={filterUserPostValue} />}
      </SubTabs.Screen>
      <SubTabs.Screen name="Đồ nhận">
        {(props) => <ReceiveOrderScreen {...props} filterValue={filterWarehouseValue} />}
      </SubTabs.Screen>
    </SubTabs.Navigator>
  );
}

export default OrderManagementScreen;
