import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FilterModal from '../../modals/FilterModal';
import React, { useState, useEffect } from 'react';
import { Chip } from 'react-native-paper';
import { appColors } from '../../constants/appColors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { appInfo } from '../../constants/appInfos';
import axiosClient from '../../apis/axiosClient';

export default function FilterSearch({navigation, filterValue, setFilterValue, isPosts, setIsPosts, warehousesID, setWarehousesID}: any) {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);

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
  const handleNavigateMapSelectWarehouses = () => {
    navigation.navigate('MapSelectWarehouseScreen', {
      warehouses: warehouses,
      setWarehousesID: setWarehousesID,
      checkWarehouses,
      setCheckWarehouses
    })
  }

  return (
    <View style={styles.filter}>
      <TouchableOpacity 
        onPress={showModal}
      >
        <Ionicons name="options" size={26} color={'#552466'}/>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ paddingVertical: 5, paddingHorizontal: 20, backgroundColor: appColors.gray5, borderRadius: 15 }}
        onPress={() => handleNavigateMapSelectWarehouses()}
      >
        <MaterialCommunityIcons name='map-search' size={25} color={appColors.primary}/>
      </TouchableOpacity>

      <View style={styles.chip}> 
        <Chip
          selected={isPosts}
          showSelectedCheck={isPosts}
          onPress={() => setIsPosts(!isPosts)}
          mode="outlined"
          selectedColor= "#552466"
          style={{borderRadius: 30, backgroundColor: 'transparent', borderColor: isPosts ? '#552466' : '#fff'}}> 
          Bài đăng 
        </Chip> 
      </View>

      <View style={styles.chip}> 
        <Chip
          selected={!isPosts}
          showSelectedCheck={!isPosts}
          onPress={() => setIsPosts(!isPosts)}
          mode="outlined"
          selectedColor= "#552466"
          style={{borderRadius: 30, backgroundColor: 'transparent', borderColor: !isPosts ? '#552466' : '#fff'}}> 
          Lưu kho
        </Chip> 
      </View> 
      
      <FilterModal visible={visible} setVisible={setVisible} hideModal={hideModal} showModal={showModal}  filterValue={filterValue} setFilterValue={setFilterValue}/>
    </View>
  );
}

const styles = StyleSheet.create({
  filter: {
    height: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    margin: 10
  },
  chip: { 
    // flex: 1
  }, 
});