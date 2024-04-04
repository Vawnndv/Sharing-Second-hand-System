import { StyleSheet, View, ScrollView, Image } from 'react-native';
import FilterOrder from './FilterOrder';
import orderAPI from '../../apis/orderApi';
import React, { useEffect, useState } from 'react';
import CardOrderView from './CardOrderView';

const userID = 29;

interface Item {
  title: string;
  location: string;
  givetype: string;
  statusname: string;
  image: string;
  status: string;
  createdat: string;
  orderid: string;
  statuscreatedat: string;
}

export default function GiveHistoryScreen() {
  const [orderGive, setOrderGive] = useState([]);

  useEffect(function(){
    getOrderList()
  }, []);

  const getOrderList = async () => {
    try {
      const res = await orderAPI.HandleOrder(
        `/listFinish?userID=${userID}`,
        'get'
      );
      
      setOrderGive(res.data.orderGive);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <FilterOrder/>
      <View style={styles.content}>
      <ScrollView 
            style={styles.scrollView}>
            {/* Các component con */}
            {orderGive.length !== 0 ? (
              orderGive.map((item : Item, index) => (
                  <CardOrderView
                      key={index}
                      title={item.title}
                      location={item.location}
                      givetype={item.givetype}
                      statusname={item.statusname}
                      image={item.image}
                      status={item.status}
                      createdat={item.createdat}
                      orderid={item.orderid}
                      statuscreatedat={item.statuscreatedat}
                      isVisibleConfirm={false}
                  />
              ))
          ) : (
              <View style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                      source={require('../../../assets/images/shopping.png')}
                      style={styles.image} 
                      resizeMode="contain"
                  />
              </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1, 
  },
  image: {
    width: 100,
    height: 80,
  },
});