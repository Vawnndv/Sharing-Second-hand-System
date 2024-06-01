import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image, RefreshControl, ActivityIndicator } from 'react-native';
import orderAPI from '../../apis/orderApi';
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
  const [refreshing, setRefreshing] = useState(false);

  const auth = useSelector(authSelector);
  const userID = auth.id;

  // useEffect(() => {
  //   if (route.params && route.params.reload) {
  //     getPostList();
  //   }
  // }, [route.params]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getPostList();
  //     return () => {};
  //   }, [])
  // );

  useEffect(() => {
    getPostList();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      getPostList()
      setRefreshing(false);
    }, 400);
  }, []);

  const getPostList = async () => {
    try {
      setOrderReceive([])
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
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <CardPostView
      navigation={navigation}
      title={item.title}
      location={item.location}
      givetype={item.givetype}
      statusname={item.statusname}
      image={item.image}
      status={item.status}
      postid={item.postid}
    />
  );

  const renderEmptyComponent = () => (
    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {
        !isLoading &&
        <Image
          source={require('../../../assets/images/shopping.png')}
          style={styles.image}
          resizeMode="contain"
        />
      }
    </View>
  );

  const renderFooterComponent = () => (
    isLoading ? <ActivityIndicator size="large" color="#000" style={{ marginTop: 10 }} /> : null
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={orderReceive}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooterComponent}
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
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
