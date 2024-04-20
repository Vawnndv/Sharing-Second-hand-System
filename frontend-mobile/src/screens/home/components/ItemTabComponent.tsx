import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RowComponent, SectionComponent } from '../../../components';
import FilterOrder from '../../../components/OrderManagement/FilterOrder';
import { appColors } from '../../../constants/appColors';
import { fontFamilies } from '../../../constants/fontFamilies';
import UserPostComponent from './UserPostComponent';
import WarehouseComponent from './WarehouseComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import postsAPI from '../../../apis/postApi';
import axios from 'axios';
import { appInfo } from '../../../constants/appInfos';

export interface filterValue {
  distance: number;
  time: number;
  category: string;
  sort: string;
}

const ItemTabComponent = () => {
  const SubTabs = createMaterialTopTabNavigator();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehousesID, setWarehousesID] = useState([])
  const [filterValue, setFilterValue] = useState<filterValue>({
    distance: 25,
    time: 14,
    category: "Tất cả",
    sort: "Mới nhất"
  })

  useEffect(() => {
    const fetchDataWarehouses = async () => {
      const response: any = await axios.get(`${appInfo.BASE_URL}/warehouse`)
      setWarehouses(response.data.wareHouses)
      // console.log("WAREHOUSES",response.data.wareHouses)
      let listWarehouseID: any = []
      response.data.wareHouses.map((warehouse: any) => {
        listWarehouseID.push(warehouse.warehouseid)
      })
      setWarehousesID(listWarehouseID)
    }
    fetchDataWarehouses()
  }, [])
  console.log("warehousesID", warehousesID)
  // console.log("setWarehousesID:", setWarehousesID);

  // console.log("warehouses", warehouses)

  const handleNavigateMapSelectWarehouses = (navigation: any) => {
    navigation.navigate('MapSelectWarehouseScreen', {
      warehouses: warehouses,
      setWarehousesID: setWarehousesID
    })
  }

  return (
    <SubTabs.Navigator
  style={styles.tabs}
  tabBar={({ state, descriptors, navigation, position }) => (
    <View style={styles.tabBar}>
      <RowComponent>
        {/* Render các tab */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const inputRange = state.routes.map((_, i) => i);

        const outputRange = inputRange.map(i => (i === index ? 1 : 0)); 
          const translateX = position.interpolate({
            inputRange,
            outputRange,
          });

          return (
            <SectionComponent 
              key={index}
              styles={{
                paddingBottom: 4,
              }}
            >
              <Text
                onPress={() => {
                  navigation.navigate(route.name);
                }}
                style={[
                  styles.tabLabel,
                  { color: isFocused ? appColors.primary : '#666', marginBottom: isFocused ? 4 : 7 },
                ]}
              >
                {typeof label === 'function' ? label({ focused: isFocused, color: appColors.primary, children: '' }) : label}
              </Text>
              {isFocused && <Animated.View style={[styles.tabIndicator, { transform: [{ translateX }] }]} />}
            </SectionComponent>
          );
        })}
      </RowComponent>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FilterOrder filterValue={filterValue} setFilterValue={setFilterValue}/>
        {state.index === 1 && (
          <TouchableOpacity
            style={{ paddingVertical: 5, paddingHorizontal: 20, backgroundColor: appColors.gray5, borderRadius: 15 }}
            onPress={() => handleNavigateMapSelectWarehouses(navigation)}
          >
            <MaterialCommunityIcons name='map-search' size={25} color={appColors.primary}/>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )}
>
  <SubTabs.Screen name="Nguời Cho">
    {(props) => <UserPostComponent  {...props} filterValue={filterValue} />}
  </SubTabs.Screen>
  <SubTabs.Screen name="Lưu kho">
    {(props) => <WarehouseComponent  {...props} filterValue={filterValue} />}
  </SubTabs.Screen>
</SubTabs.Navigator>

  );

  // return (
  //   <SubTabs.Navigator style={styles.tabs}>
  //     <SubTabs.Screen
  //       name="Bài đăng"
  //       component={UserPostComponent}
  //       options={{
  //         tabBarLabel: 'Bài đăng',
  //         tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
  //         tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
  //         tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
  //       }}
  //     />
  //     <SubTabs.Screen
  //       name="Lưu kho"
  //       component={WarehouseComponent}
  //       options={{
  //         tabBarLabel: 'Lưu kho',
  //         tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
  //         tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
  //         tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
  //       }}
  //     />
  //   </SubTabs.Navigator>
  // );
}

export default ItemTabComponent;
  
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent', // Để phù hợp với màu nền của FilterComponent
  },
  tabs: {
    flexDirection: 'column',
    backgroundColor: '#fff'
  },

  tabItem: {
    width: '60%',
    backgroundColor: 'transparent',
  },

  tabLabel: {
    textTransform: 'capitalize',
    color: appColors.primary,
    fontSize: 17,
    fontFamily: fontFamilies.bold,
  },

  tabIndicator: {
    backgroundColor: appColors.primary,
    height: 3,
  },
});