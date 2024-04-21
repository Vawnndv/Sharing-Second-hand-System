import MapView, {Callout, Marker, PROVIDER_DEFAULT} from 'react-native-maps';

import * as Location from 'expo-location';
import {Dimensions, View, StyleSheet, TextInput, Text, ScrollView, Keyboard, TouchableOpacity,KeyboardAvoidingView, Alert} from "react-native"
import ContainerComponent from '../../components/ContainerComponent';
import { useEffect, useRef, useState } from 'react';
import { EvilIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';

const { width, height } = Dimensions.get("window")

const initalPosition = {
  latitude: 10.768879,
  longitude: 106.656034,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02 * width / height
}

// const warehouses = [
//     {
//         warehouseid: 19,
//         warehousename: 'Kho số 1',
//         address: 'Đại học khoa học tự nhiên',
//         latitude: 10.763025311133902,
//         longitude: 106.68249312376167
//     },
//     {
//         warehouseid: 20,
//         warehousename: 'Kho số 2',
//         address: 'Nhà thi đấu Phú Thọ',
//         latitude: 10.7688298,
//         longitude: 106.6577947
//     }
// ]

export default function MapSelectWarehouse({navigation, route}: any) {

    const {warehouses, checkWarehouses, setCheckWarehouses}: any = route.params;
    // console.log("setWarehousesID", setWarehousesID)

    // const [checkWarehousesOnMap, setCheckWarehousesOnMap] = useState(Array.from({length: warehouses.length}, () => false))
    const [checkWarehousesOnMap, setCheckWarehousesOnMap] = useState(checkWarehouses)
    const [location, setLocation] = useState<any>(null);
    // console.log(location)

    const handleGetMyLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
          }
    
          let location: any = await Location.getCurrentPositionAsync({});
        //   console.log(location)
          const locationTarget = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
          setLocation(locationTarget)
          moveCameraToCoordinate(locationTarget)
        //   setLocation(location);
    }

    // thực hiện hiển thị tại vị trí người dùng trước
    useEffect(() => {
        handleGetMyLocation()
    },[])

    // dùng để di chuyển camera khi click vào 1 kết quả
    const mapViewRef = useRef<MapView>(null);

    const moveCameraToCoordinate = (locationTarget: any) => {
      const camera = {
        center: locationTarget,
        zoom: 15, // Level of zoom
      };
  
      // Move camera to the specified coordinate
      mapViewRef.current?.animateCamera(camera, { duration: 1500 });
    };


    const handleClickWarehouse = (index: number) => {
        let newData = [...checkWarehousesOnMap]
        newData[index] = !newData[index]
        setCheckWarehousesOnMap(newData)
        console.log(checkWarehousesOnMap)
        // console.log('press check box')
    }

    const handleConfirmSelect = () => {
        let listWarehouseID: any = []
        checkWarehousesOnMap.map((item:any, index:number) => {
            if(item === true){
                listWarehouseID.push(warehouses[index].warehouseid)
            }
        })

        if (route.params && route.params.setWarehousesID) {
            route.params.setWarehousesID(listWarehouseID);
        }
        setCheckWarehouses(checkWarehousesOnMap)
        // setWarehousesID(listWarehouseID)
        navigation.goBack()
    }
    
    return (
        <ContainerComponent back>

            <KeyboardAvoidingView style={styles.container}>
                <MapView
                ref={mapViewRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={initalPosition}
                showsUserLocation={true}
                showsMyLocationButton={false}
                userLocationAnnotationTitle="Your Location">
                    {
                        warehouses.map((item: any, index: number) => {
                            return(
                                <Marker
                                    coordinate={{
                                        latitude: parseFloat(item.latitude),
                                        longitude: parseFloat(item.longitude)
                                    }}
                                    onPress={() => handleClickWarehouse(index)}
                                    key={index}
                                >
                    
                                    <View style={styles.boxLocation}>
                                        <View style={{backgroundColor: 'white', borderRadius: 10, display: 'flex', flexDirection:'column', alignItems: 'center'}}>
                                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                <MaterialCommunityIcons name='warehouse' size={25} color='#693F8B'/>
                                                <TouchableOpacity
                                                    onPress={() => console.log('checkbox')}>
                                                    <Checkbox
                                                        status={checkWarehousesOnMap[index] === false ? 'unchecked' : 'checked'}
                                                        uncheckedColor='#693F8B'
                                                        color='#693F8B'
                                                        />
                                                </TouchableOpacity>
                                                
                                            </View>
                                            <Text style={{fontSize: 15, fontWeight: 'bold'}}>{item.warehousename}</Text>
                                            <Text style={{maxWidth: 150, textAlign: 'center'}}>{item.address}</Text>
                                        </View>
                                        
                                        <Ionicons name='location' size={50} style={{color: '#693F8B'}}/>
                                    </View>
                                
                                    
                                    
                                </Marker>
                            )
                        })
                    }
                </MapView>
                
                {/* <View style={styles.header}>
                    <Text>Bản đồ đang hiển thị các kho ở gần bạn trong bán kính 20km</Text>
                </View> */}

                <TouchableOpacity style={styles.getMyLocation}
                    onPress={handleGetMyLocation}>
                    <EvilIcons name='location' size={35} color='white'/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleConfirmSelect()}
                    style={styles.confirmButton}>
                    <Text style={{fontSize: 16, color: 'white'}}>Xác nhận chọn kho</Text>
                </TouchableOpacity>
                
            </KeyboardAvoidingView>
            
            
        </ContainerComponent>
        
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#ffffff",
        position: 'relative'
    },
    map: {
        width: '100%',
        height: '100%',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        paddingHorizontal: 35,
        paddingVertical: 10,
        backgroundColor: 'white',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    confirmButton: {
        position: 'absolute',
        bottom: 10,
        backgroundColor: '#693F8B',
        borderRadius: 50,
        paddingHorizontal: 25,
        paddingVertical: 15,
        // alignSelf: 'flex-end', // Thiết lập alignSelf là flex-start
        marginBottom: 10,
        elevation: 8,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    getMyLocation: {
        position: 'absolute',
        bottom: 80,
        right: 10,
        elevation: 8,
        width: 60,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: '#693F8B',
        borderRadius: 100,
    },
    pinLocation: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -50 }],
    },
    boxLocation: {
        elevation: 8,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
})