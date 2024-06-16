import MapView, {Callout, Marker, PROVIDER_DEFAULT} from 'react-native-maps';

import * as Location from 'expo-location';
import {Dimensions, View, StyleSheet, TextInput, Text, ScrollView, Keyboard, TouchableOpacity,KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Modal, Pressable} from "react-native"
import ContainerComponent from '../../components/ContainerComponent';
import { useEffect, useRef, useState } from 'react';
import { EvilIcons, Ionicons, MaterialCommunityIcons, FontAwesome6} from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { RadioButton } from 'react-native-paper';
import { fontFamilies } from '../../constants/fontFamilies';

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
        backgroundColor: '#693F8B',
    }
})

export default function MapSelectWarehouseGive({navigation, route}: any) {

    const {warehouses, setWarehouseSelected}: any = route.params;
    // console.log("setWarehousesID", setWarehousesID)

    // const [checkWarehousesOnMap, setCheckWarehousesOnMap] = useState(Array.from({length: warehouses.length}, () => false))
    const [radioSelect, setRadioSelect] = useState(warehouses[0].warehouseid)
    const [location, setLocation] = useState<any>(null);

    const [visible, setVisible] = useState(false)
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    // console.log(location)

    const handleGetMyLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền truy cập vào vị trí đã bị hoãn');
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

    const handleConfirmSelect = () => {
        let warehouseSeleted = {}
        for(let i = 0; i < warehouses.length; i++){
            if(warehouses[i].warehouseid === radioSelect){
                warehouseSeleted = warehouses[i]
                break
            }
        }
        setWarehouseSelected(warehouseSeleted)
        navigation.goBack()
        console.log(warehouseSeleted)
        // navigation.goBack()
    }
    
    const handleSelectWarehouse = (whid: any) => {
        console.log(whid)
        setRadioSelect(whid)
    }   
    console.log(radioSelect)

    const ConfirmComponent = ({}: any) => {
        const [tempSelectedWarehouse, setTempSelectedWarehouse] = useState(radioSelect)
        const handleSelectTempWarehouse = (whid: any) => {
            setTempSelectedWarehouse(whid)
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
                                            <TouchableOpacity onPress={() => handleSelectWarehouse(warehouse.warehouseid)}>
                                                <RadioButton
                                                    value={warehouse.warehouseid}
                                                    status={tempSelectedWarehouse === warehouse.warehouseid ? 'checked' : 'unchecked'}
                                                    uncheckedColor='#693F8B'
                                                    color='#693F8B'
                                                    onPress={() => handleSelectTempWarehouse(warehouse.warehouseid)}/>
                                            </TouchableOpacity>
                                            
                                        </View>
                                    )
                                })
                            }
                            </ScrollView>
                            
    
                            <View style={stylesConfirmComponent.buttonContainer}>
                                <TouchableOpacity
                                    onPress={() => {setVisible(false), setRadioSelect(tempSelectedWarehouse)}}
                                    style={[stylesConfirmComponent.button, {backgroundColor: '#693F8B',}]}>
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
                                    onPress={() => handleSelectWarehouse(item.warehouseid)}
                                    key={index}
                                >
                    
                                    <View style={styles.boxLocation}>
                                        <View style={{backgroundColor: 'white', borderRadius: 10, display: 'flex', flexDirection:'column', alignItems: 'center'}}>
                                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                <MaterialCommunityIcons name='warehouse' size={25} color='#693F8B'/>
                                                <TouchableOpacity
                                                    onPress={() => console.log('checkbox')}>
                                                    <RadioButton
                                                        value={item.warehouseid}
                                                        status={radioSelect === item.warehouseid ? 'checked' : 'unchecked'}
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

                <TouchableOpacity style={styles.warehouses}
                    onPress={showModal}>
                    <MaterialCommunityIcons name='warehouse' size={35} color='white'/>
                </TouchableOpacity>

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
            
            <ConfirmComponent visible={visible} setVisible={setVisible} hideModal={hideModal} warehouses={warehouses} radioSelect={radioSelect} setRadioSelect={handleSelectWarehouse}/>
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
    warehouses: {
        position: 'absolute',
        top: 20,
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