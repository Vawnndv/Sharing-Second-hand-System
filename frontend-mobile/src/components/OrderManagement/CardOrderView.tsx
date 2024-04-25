import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Modal, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconA from 'react-native-vector-icons/AntDesign';
import { Pressable } from 'react-native';
import ViewDetailOrder from '../../modals/ViewDetailOrder';
import { fontFamilies } from '../../constants/fontFamilies';

const {width, height} = Dimensions.get("window");

export default function CardOrderView ({ navigation, title, location, givetype, statusname, image, status, createdat, orderid, statuscreatedat, isVisibleConfirm, imgconfirmreceive}: any) {
  // const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          // setIsModalVisible(true)
          navigation.navigate('ViewDetailOrder', { orderid: orderid })
        }}
      >
        <View style={styles.card}>
            <View style={styles.content}>
              <Image
                  source={{ uri: image }} 
                  style={styles.image} 
                  resizeMode="contain"
              />

              <View style={styles.infomation}>
                  <Text style={{ fontWeight: 'bold', fontFamily: fontFamilies.bold, width: width - 150 }}>{title}</Text>
                  <View style={{ paddingTop: 2, flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="map-pin" size={20} color="#552466" />
                      <Text style={{ paddingLeft: 20, width: width - 150 }}>{location}</Text>
                  </View>

                  <View style={{ paddingTop: 2, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                      <IconA name="profile" size={20} color="#552466" />
                      <Text style={{ paddingLeft: 10, fontWeight: 'bold' }}> Phương thức: </Text>
                      <Text> {givetype} </Text>
                  </View>
              </View>
            </View>

            <Text style={{ textAlign: 'right', color: 'red', marginBottom: 10, marginRight: 10}}> {statusname} </Text>
        </View>
      </TouchableOpacity>

      {/* <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <ViewDetailOrder 
          setIsModalVisible={setIsModalVisible} 
          orderid={orderid} 
        />
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: '2%',
    width: '96%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },
  content: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    objectFit: 'cover',
    borderRadius: 5,
    marginHorizontal: 5
  },
  infomation: {
    width: width - 90,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingLeft: 10
  }
});