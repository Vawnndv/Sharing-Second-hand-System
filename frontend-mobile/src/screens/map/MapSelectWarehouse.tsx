import MapView, {Callout, Marker, PROVIDER_DEFAULT} from 'react-native-maps';

import * as Location from 'expo-location';
import {Dimensions, View, StyleSheet, TextInput, Text, ScrollView, Keyboard, TouchableOpacity,KeyboardAvoidingView, Alert, Modal} from "react-native"
import ContainerComponent from '../../components/ContainerComponent';
import { useEffect, useRef, useState } from 'react';
import { EvilIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { fontFamilies } from '../../constants/fontFamilies';
import axiosClient from '../../apis/axiosClient';
import { appInfo } from '../../constants/appInfos';
import React from 'react';
import { appColors } from '../../constants/appColors';
import ButtonComponent from '../../components/ButtonComponent';

const { width, height } = Dimensions.get("window")

const initalPosition = {
  latitude: 10.768879,
  longitude: 106.656034,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02 * width / height
}


const stylesConfirmComponent = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        opacity: 500,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        width: '80%',
        display: 'flex',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        opacity: 500
    },
    buttonContainer: {
        width: '100%', 
        display: 'flex',
        flexDirection: 'row', 
        marginTop: 20,
        justifyContent: 'space-around'
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: appColors.primary,
    }
})

export default function MapSelectWarehouse({navigation, route}: any) {

    const {checkWarehouses, setCheckWarehouses}: any = route.params;

    const [warehouses, setWarehouses] = useState<any>([])

    const [checkWarehousesOnMap, setCheckWarehousesOnMap] = useState(checkWarehouses)
    const [location, setLocation] = useState<any>(null);

    const [visible, setVisible] = useState(false)
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleGetMyLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền truy cập vào vị trí đã bị hoãn');
            return;
          }
    
          let location: any = await Location.getCurrentPositionAsync({});
          const locationTarget = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
          setLocation(locationTarget)
          moveCameraToCoordinate(locationTarget)
    }

    const getWarehouses = async () => {
        try {
            const response: any = await axiosClient.get(`${appInfo.BASE_URL}/warehouse`)
            setWarehouses(response.wareHouses)
        } catch (error) {
            console.log(error)
        }
    }

    // thực hiện hiển thị tại vị trí người dùng trước
    useEffect(() => {
        handleGetMyLocation()
        getWarehouses() 
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
        navigation.goBack()
    }

    const ConfirmComponent = ({}: any) => {
        const [tempSelectedWarehouse, setTempSelectedWarehouse] = useState(checkWarehousesOnMap)
        const handleSelectTempWarehouse = (index: number) => {
            const newSelectedWarehouse = [...tempSelectedWarehouse]
            newSelectedWarehouse[index] = !newSelectedWarehouse[index]
            setTempSelectedWarehouse(newSelectedWarehouse)
        }
        return (
    
                <Modal
                animationType="slide"
                transparent={true}
                visible={visible}>
                    <View style={stylesConfirmComponent.container}>
                        <View style={stylesConfirmComponent.modalView}>
                            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                                    {'Danh sách kho'}
                                </Text>
                            </View>
                            
                            <ScrollView horizontal={false} style={{maxHeight: 300}}>
                            {
                                warehouses.map((warehouse: any, index: number) => {
                                    return (
                                        <View key={index} style={{paddingVertical: 5, display: 'flex', flexDirection: 'row'}}>
                                            <TouchableOpacity style={{flex: 1}}
                                                onPress={() => {setVisible(false), moveCameraToCoordinate({
                                                    latitude: parseFloat(warehouse.latitude),
                                                    longitude: parseFloat(warehouse.longitude)
                                                })}}>
                                                <Text style={{fontFamily: fontFamilies.bold, fontSize: 15}}>{warehouse.warehousename}</Text>
                                                <Text>{warehouse.address}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleSelectTempWarehouse(index)}>
                                                <Checkbox
                                                    status={tempSelectedWarehouse[index] ? 'checked' : 'unchecked'}
                                                    uncheckedColor={appColors.primary}
                                                    color={appColors.primary}
                                                    onPress={() => handleSelectTempWarehouse(index)}/>
                                            </TouchableOpacity>
                                            
                                        </View>
                                    )
                                })
                            }
                            </ScrollView>
                            
    
                            <View style={stylesConfirmComponent.buttonContainer}>
                                <TouchableOpacity
                                    onPress={() => {setVisible(false), setCheckWarehousesOnMap(tempSelectedWarehouse)}}
                                    style={[stylesConfirmComponent.button, {backgroundColor: appColors.primary,}]}>
                                    <Text style={{color: 'white'}}>
                                        Xác nhận
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    </View>
                    
                    
                </Modal>
    
            
        )
    }

    interface WarehouseMarkerProps {
        item: {
            latitude: string;
            longitude: string;
            warehousename: string;
            address: string;
        };
        index: number;
        onPress: () => void;
        isChecked: boolean;
    }
    

    const WarehouseMarker: React.FC<WarehouseMarkerProps> = React.memo(({ item, index, onPress, isChecked }) => {
        return (
            <Marker
                coordinate={{
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                }}
                onPress={() => onPress()}
                key={index}
            >
                <TouchableOpacity style={styles.boxLocation}>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons name='warehouse' size={25} color={appColors.primary} />
                            <TouchableOpacity onPress={() => console.log('checkbox')}>
                                <Checkbox
                                    status={isChecked ? 'checked' : 'unchecked'}
                                    uncheckedColor={appColors.primary}
                                    color={appColors.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.warehousename}</Text>
                        <Text style={{ maxWidth: 150, textAlign: 'center' }}>{item.address}</Text>
                    </View>
                    <Ionicons name='location' size={50} style={{ color: appColors.primary }} />
                </TouchableOpacity>
            </Marker>
        );
    });
    
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
                                <WarehouseMarker
                                    key={index}
                                    item={item}
                                    index={index}
                                    onPress={() => handleClickWarehouse(index)}
                                    isChecked={checkWarehousesOnMap[index] !== false}
                                />
                                )
                        })
                    }
                </MapView>
                
                {/* <View style={styles.header}>
                    <Text>Bản đồ đang hiển thị các kho ở gần bạn trong bán kính 20km</Text>
                </View> */}
                <TouchableOpacity style={styles.warehouses}
                    onPress={showModal}>
                    <MaterialCommunityIcons name='warehouse' size={35} color='white'/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.getMyLocation}
                    onPress={handleGetMyLocation}>
                    <EvilIcons name='location' size={35} color='white'/>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    onPress={() => handleConfirmSelect()}
                    style={styles.confirmButton}>
                    <Text style={{fontSize: 16, color: 'white'}}>Xác nhận chọn kho</Text>
                </TouchableOpacity> */}
                <ButtonComponent
                    disable={false}
                    onPress={() => handleConfirmSelect()}
                    text={"Xác nhận chọn kho"}
                    type='primary'
                    iconFlex="right"
                    styles={styles.confirmButton}
                />      
            </KeyboardAvoidingView>
            
            <ConfirmComponent />
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
        backgroundColor: appColors.primary,
        paddingHorizontal: 25,
        paddingVertical: 15,
        marginBottom: 5,
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
        backgroundColor: appColors.primary,
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
    },warehouses: {
        position: 'absolute',
        top: 20,
        right: 10,
        elevation: 8,
        width: 60,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: appColors.primary,
        borderRadius: 100,
    },
})