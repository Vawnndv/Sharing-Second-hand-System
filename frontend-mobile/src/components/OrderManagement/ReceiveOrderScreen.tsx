import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Image, ActivityIndicator, RefreshControl } from "react-native";
import FilterOrder from "./FilterOrder";
import orderAPI from "../../apis/orderApi";
import CardOrderView from "./CardOrderView";
import { GetCurrentLocation } from "../../utils/GetCurrenLocation";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducers";
import { useFocusEffect } from "@react-navigation/native";
import { category } from "../../constants/appCategories";
import LoadingComponent from "../LoadingComponent";

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
  imgconfirmreceive: string;
}


export default function ReceiveOrderScreen({ navigation, route, filterValue }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [orderReceive, setOrderReceive] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const auth = useSelector(authSelector);
  const userID = auth.id;


  useEffect(() => {
    getOrderList();
  }, [filterValue]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      getOrderList()
      setRefreshing(false);
    }, 1000);
  }, []);

  const getOrderList = async () => {
    try {
      setOrderReceive([]);
      setIsLoading(true);
      let location = await GetCurrentLocation();
      if (!location) {
        console.log("Failed to get location.");
        return;
      }

      const res = await orderAPI.HandleOrder(
        `/list`,
        {
          userID: userID,
          distance: filterValue.distance,
          category: filterValue.category,
          sort: filterValue.sort,
          time: filterValue.time,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        "post"
      );

      setIsLoading(false);
      setOrderReceive(res.data.orderReceive);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <CardOrderView
      navigation={navigation}
      title={item.title}
      location={item.location}
      givetype={item.givetype}
      statusname={item.status}
      image={item.image}
      status={item.status}
      createdat={item.createdat}
      orderid={item.orderid}
      statuscreatedat={item.statuscreatedat}
      isVisibleConfirm={true}
      imgconfirmreceive={item.imgconfirmreceive}
    />
  );

  const renderEmptyComponent = () => (
    <View style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {
        !isLoading && 
        <Image
          source={require("../../../assets/images/shopping.png")}
          style={styles.image}
          resizeMode="contain"
        />
      }
    </View>
  );

  const renderFooterComponent = () => (
    isLoading ? <LoadingComponent isLoading={isLoading} /> : null
  );

  return (
    <View style={styles.container}>
      {/* <FilterOrder filterValue={filterValue} setFilterValue={setFilterValue} /> */}
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
    // backgroundColor: "#fff",
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
