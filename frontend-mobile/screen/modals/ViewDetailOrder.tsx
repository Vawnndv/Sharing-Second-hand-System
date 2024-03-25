import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import StepIndicatorOrder from '../../components/OrderManagement/StepIndicatorOrder';

interface Data {
  title: string;
  locationgive: string;
  givetype: string;
  status: string;
  image: string;
}
export default function ViewDetailOrder({ setIsModalVisible, data }: { setIsModalVisible: (isVisible: boolean) => void, data: Data }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{ justifyContent: 'flex-start' }}>
          <Ionicons name="arrow-back" size={28}></Ionicons>
        </TouchableOpacity>
        <Text style={{marginLeft: '25%', fontSize: 18, fontWeight: 'bold'}}>{data.status}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.info}>
          <Image
            source={{ uri: data.image }} 
            style={styles.image} 
            resizeMode="contain"
          />

          <View style={styles.infomation}>
            <Text style={{ fontWeight: 'bold' }}>{data.title}</Text>
            <View style={{ paddingTop: 2, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="map-pin" size={20} color="#552466" />
                <Text style={{ paddingLeft: 20 }}>{data.locationgive}</Text>
            </View>

            <View style={{ paddingTop: 2, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}> {data.status} </Text>
                <Text style={{ color: 'red', fontWeight: 'bold' }}> Thứ 6, 17/01/2024</Text>
            </View>
          </View>
        </View>

        <Button mode="contained" onPress={() => console.log('Xác nhận')} buttonColor='red' style={{width: '40%', marginVertical: 10}}>
          Xác nhận
        </Button>

        <View style={styles.process}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 3 }}>
            <View>
              <Text style={{ fontWeight: 'bold' }}>Quá Trình</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>Mã đơn hàng</Text>
              <Text style={{ paddingLeft: 5, fontWeight: 'bold', color: 'blue' }}>YE873</Text>
            </View>
          </View>

          <View style={{borderBottomWidth: 1, marginTop: 4, borderBottomColor: 'grey'}}/>

          <ScrollView>
            <StepIndicatorOrder/>
          </ScrollView>
        </View>

      </View>
      {/* <Text style={styles.body}>Modal</Text> */}
      {/* <View style={styles.separator} /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '10%',
    flexDirection: 'row',
    padding: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  container: {
    flex: 1
  },
  body: {
    margin: 15,
    flexDirection: 'column',
    gap: 5
  },
  info: {
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
    height: 110,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infomation: {
    width: '70%',
    // flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: 90,
    height: 90,
    objectFit: 'cover',
    borderRadius: 5,
    marginHorizontal: 5
  },
  process: {
    height: 500,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
    // display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    flexGrow: 1, // Thiết lập để mở rộng theo chiều cao
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: 'red'
  },
});
