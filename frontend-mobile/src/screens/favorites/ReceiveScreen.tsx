import { StyleSheet, View, ScrollView, Image } from 'react-native';
import orderAPI from '../../apis/orderApi';
import React, { useEffect, useState } from 'react';
import { GetCurrentLocation } from '../../utils/GetCurrenLocation';
import { LoadingModal } from '../../modals';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import { useFocusEffect } from '@react-navigation/native';
import CardPostView from '../posts/CardPostView';

interface Item {
  title: string;
  location: string;
  givetype: string;
  statusname: string;
  image: string;
  status: string;
  postid: string;
}

export default function ReceiveScreen({ navigation, route }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [orderReceive, setOrderReceive] = useState([]);

  const auth = useSelector(authSelector);
  const userID = auth.id;

   // Sử dụng useEffect để theo dõi tham số điều hướng
   useEffect(() => {
    if (route.params && route.params.reload) {
      getPostList();
    }
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      getPostList()
      return () => {};
    }, [])
  );

  const getPostList = async () => {
    try {
      setIsLoading(true);
      let location = await GetCurrentLocation();
      if (!location) {
        console.log("Failed to get location.");
        return;
      }

      const res = await orderAPI.HandleOrder(
        `/listReceive`,
        {
          userID: userID
        },
        'post'
      );
      
      setIsLoading(false);
      setOrderReceive(res.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* <FilterOrder filterValue={filterValue} setFilterValue={setFilterValue}/> */}
      <View style={styles.content}>
      <ScrollView 
            style={styles.scrollView}>
            {/* Các component con */}
            {orderReceive.length !== 0 ? (
              orderReceive.map((item : Item, index) => (
                  <CardPostView
                      navigation={navigation}
                      key={index}
                      title={item.title}
                      location={item.location}
                      givetype={item.givetype}
                      statusname={item.statusname}
                      image={item.image}
                      status={item.status}
                      postid={item.postid}
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