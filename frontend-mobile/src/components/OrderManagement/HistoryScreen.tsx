import { StyleSheet, View } from 'react-native';
import DropdownContentComponent from './DropdownContentComponent';
import React, { useEffect, useState } from 'react';
import orderAPI from '../../apis/orderApi';
import FilterOrder from './FilterOrder';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';

export default function HistoryScreen() {
  const [orderGive, setOrderGive] = useState([]);
  const [orderReceive, setOrderReceive] = useState([]);

  const auth = useSelector(authSelector);
  const userID = auth.id;

  useEffect(function() {
    getOrderList()
  }, []);

  const getOrderList = async () => {
    try {
      const res = await orderAPI.HandleOrder(
        `/listFinish?userID=${userID}`,
        'get'
      );
      
      setOrderGive(res.data.orderGive);
      setOrderReceive(res.data.orderReceive);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <FilterOrder/>
      <View style={styles.content}>
        <DropdownContentComponent title="Đồ cho" data={orderGive} isVisibleConfirm={false}/>
        <DropdownContentComponent title="Đồ nhận" data={orderReceive} isVisibleConfirm={false}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filter: {
    height: 40,
    backgroundColor: '#f1f1f1'
  },
  content: {
    flex: 1,
    flexDirection: 'column'
  }
});