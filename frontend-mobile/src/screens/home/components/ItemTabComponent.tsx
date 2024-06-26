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
import { appInfo } from '../../../constants/appInfos';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../redux/reducers/authReducers';
import { category } from '../../../constants/appCategories';
import axiosClient from '../../../apis/axiosClient';

export interface filterValue {
  distance: number;
  time: number;
  category: string[];
  sort: string;
}


const ItemTabComponent = ({navigation}: any) => {
  const auth = useSelector(authSelector)
  const SubTabs = createMaterialTopTabNavigator();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehousesID, setWarehousesID] = useState([])
  const [filterValue, setFilterValue] = useState<filterValue>({
    distance: -1,
    time: -1,
    category: category,
    sort: "Mới nhất"
  })

  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const getUserAddress = async () => {
      const response: any = await axiosClient.get(`${appInfo.BASE_URL}/user/get-user-address?userId=${auth.id}`)
      if(response.data === null){
        // setIsNewUser(true)
        navigation.navigate('MapSettingAddressScreen',{useTo: 'setAddress'});
      }
    }
    getUserAddress()
  }, [])

  const [checkWarehouses, setCheckWarehouses] = useState(Array.from({ length: warehouses.length }, () => true))
  useEffect(() => {
    setCheckWarehouses(Array.from({ length: warehouses.length }, () => true))
  }, [warehouses])

  useEffect(() => {
    const fetchDataWarehouses = async () => {
      const response: any = await axiosClient.get(`${appInfo.BASE_URL}/warehouse`)
      setWarehouses(response.wareHouses)
      let listWarehouseID: any = []
      response.wareHouses.map((warehouse: any) => {
        listWarehouseID.push(warehouse.warehouseid)
      })
      setWarehousesID(listWarehouseID)
    }
    fetchDataWarehouses()

    
  }, [])

  // useEffect(() => {
  //   if(isNewUser){
  //     navigation.navigate('MapSettingAddressScreen',{useTo: 'setAddress'});
  //   }
  // }, [isNewUser])

  const handleNavigateMapSelectWarehouses = (navigation: any) => {
    navigation.navigate('MapSelectWarehouseScreen', {
      warehouses: warehouses,
      setWarehousesID: setWarehousesID,
      checkWarehouses,
      setCheckWarehouses
    })
    // navigation.navigate('MapSelectWarehouseGiveScreen', {
    //   warehouses: warehouses,
    //   setWarehousesID: setWarehousesID,
    //   checkWarehouses,
    //   setCheckWarehouses
    // })
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
              style={{ paddingVertical: 5, paddingHorizontal: 20, backgroundColor: appColors.white5, borderRadius: 15 }}
              onPress={() => handleNavigateMapSelectWarehouses(navigation)}
            >
              <MaterialCommunityIcons name='map-search' size={25} color={appColors.primary2}/>
            </TouchableOpacity>
          )}
        </View>
      </View>
      )}
    >
      <SubTabs.Screen name="Bài Đăng">
        {(props) => <UserPostComponent  {...props} filterValue={filterValue} warehousesID={warehousesID} />}
      </SubTabs.Screen>
      <SubTabs.Screen name="Lưu kho">
        {(props) => <WarehouseComponent  {...props} filterValue={filterValue} warehousesID={warehousesID} />}
      </SubTabs.Screen>
    </SubTabs.Navigator>
  );

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
    color: appColors.primary2,
    fontSize: 20,
    fontFamily: fontFamilies.bold,
  },

  tabIndicator: {
    backgroundColor: appColors.primary,
    height: 3,
  },
});