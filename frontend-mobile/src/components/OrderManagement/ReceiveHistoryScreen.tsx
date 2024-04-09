import { StyleSheet, View, ScrollView, Image } from 'react-native';
import FilterOrder from './FilterOrder';
import orderAPI from '../../apis/orderApi';
import React, { useEffect, useState } from 'react';
import CardOrderView from './CardOrderView';
import { GetCurrentLocation } from '../../utils/GetCurrenLocation';
import { LoadingModal } from '../../modals';

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
  imgconfirmreceive:string;
}

export default function ReceiveHistoryScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderReceive, setOrderReceive] = useState([]);
  const [filterValue, setFilterValue] = useState({
    distance: 25,
    time: 30,
    category: "Tất cả",
    sort: "Mới nhất"
})
console.log(filterValue)

  useEffect(function(){
    getOrderList()
  }, [filterValue]);

  const getOrderList = async () => {
    try {
      setIsLoading(true);
      let location = await GetCurrentLocation();
      if (!location) {
        console.log("Failed to get location.");
        return;
      }

      const res = await orderAPI.HandleOrder(
        `/listFinish?userID=${userID}&distance=${filterValue.distance}&time=${filterValue.time}&category=${filterValue.category}&sort=${filterValue.sort}&latitude=${location.latitude}&longitude=${location.longitude}`,
        'get'
      );
      
      setIsLoading(false);
      setOrderReceive(res.data.orderReceive);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <FilterOrder filterValue={filterValue} setFilterValue={setFilterValue}/>
      <View style={styles.content}>
      <ScrollView 
            style={styles.scrollView}>
            {/* Các component con */}
            {orderReceive.length !== 0 ? (
              orderReceive.map((item : Item, index) => (
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
                      imgconfirmreceive={item.imgconfirmreceive}
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
          <LoadingModal visible={isLoading} />
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