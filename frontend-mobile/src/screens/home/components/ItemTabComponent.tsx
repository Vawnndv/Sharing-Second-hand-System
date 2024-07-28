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
import { useDispatch, useSelector } from 'react-redux';
import { authSelector } from '../../../redux/reducers/authReducers';
import { category } from '../../../constants/appCategories';
import axiosClient from '../../../apis/axiosClient';
import userAPI from '../../../apis/userApi';
import { updateCountOrder, updateLikePosts, updateReceivePosts } from '../../../redux/reducers/userReducers';
import TabComponent from '../../../components/TabComponent';

export interface filterValue {
  distance: number;
  time: number;
  category: string[];
  sort: string;
}


const ItemTabComponent = ({navigation}: any) => {
  const auth = useSelector(authSelector)
  const dispatch = useDispatch();
  const SubTabs = createMaterialTopTabNavigator();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [warehousesID, setWarehousesID] = useState([])
  const [filterUserPostValue, setFilterUserPostValue] = useState<filterValue>({
    distance: -1,
    time: -1,
    category: category,
    sort: "Mới nhất"
  })

  const [filterWarehouseValue, setFilterWarehouseValue] = useState<filterValue>({
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
        navigation.navigate('MapSettingAddressScreen',{useTo: 'setAddress'});
      }
    }
    getUserAddress()
  }, [])

  useEffect(() => {
    const getUserLikePosts = async () => {
      try {
        const response: any = await userAPI.HandleUser(`/get-like-posts?userId=${auth.id}`);
        if(response.data === null){
          dispatch(updateLikePosts([]));
        } else {
          dispatch(updateLikePosts(response.data));
        }
      } catch(error: any) {
        dispatch(updateLikePosts([]));
      }
    }

    const getUserReceivePost = async () => {
      try {
        const response: any = await userAPI.HandleUser(`/get-receive-posts?userId=${auth.id}`);
        if(response.data === null){
          dispatch(updateReceivePosts([]));
        } else {
          dispatch(updateReceivePosts(response.data));
        }
      } catch(error: any) {
        dispatch(updateReceivePosts([]));
      }
    }

    getUserLikePosts();
    getUserReceivePost();
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


  const handleNavigateMapSelectWarehouses = (navigation: any) => {
    navigation.navigate('MapSelectWarehouseScreen', {
      warehouses: warehouses,
      setWarehousesID: setWarehousesID,
      checkWarehouses,
      setCheckWarehouses
    })
  }

  return (
    <SubTabs.Navigator
    tabBar={props => (
      <TabComponent
        {...props}
        filterUserPostValue={filterUserPostValue}
        filterWarehouseValue={filterWarehouseValue}
        setFilterUserPostValue={setFilterUserPostValue}
        setFilterWarehouseValue={setFilterWarehouseValue}
        handleNavigateMapSelectWarehouses={handleNavigateMapSelectWarehouses}
        isHome={true}
      />
    )}
    >
      <SubTabs.Screen name="Bài Đăng">
        {(props) => <UserPostComponent  {...props} filterValue={filterUserPostValue} warehousesID={warehousesID} />}
      </SubTabs.Screen>
      <SubTabs.Screen name="Lưu kho">
        {(props) => <WarehouseComponent  {...props} filterValue={filterWarehouseValue} warehousesID={warehousesID} />}
      </SubTabs.Screen>
    </SubTabs.Navigator>
  );

}

export default ItemTabComponent;
  