import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';

import * as ExpoLocation from 'expo-location';
import {Dimensions, View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView, Keyboard, KeyboardAvoidingView, Alert, useColorScheme} from "react-native"
import ContainerComponent from '../../components/ContainerComponent';
import { useEffect, useRef, useState } from 'react';
import { EvilIcons, Ionicons, MaterialIcons, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useDebounce } from '../../hooks/useDebounce';
import { appInfo } from '../../constants/appInfos';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, updateAuth } from '../../redux/reducers/authReducers';
import { LoadingModal } from '../../modals';
import { isLoading } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_MAP_API_KEY, BING_MAP_API_KEY } from '@env';
import axiosClient from '../../apis/axiosClient';
import { appColors } from '../../constants/appColors';
import { ArrowRight, Location } from 'iconsax-react-native';
import ButtonComponent from '../../components/ButtonComponent';
import React from 'react';


const getUrlRequest = (query: string) => {
    return `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
}


const { width, height } = Dimensions.get("window")

let initalPosition = {
  latitude: 10.768879,
  longitude: 106.656034,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02 * width / height
}

const LocationComponent = ({name, address, handleClick}: any) => {
    return(
        <TouchableOpacity style={{display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-start',
            marginVertical: 10, marginHorizontal: 20
        }}
        onPress={() => handleClick()}>
            <Text style={{fontSize: 15}}>{name}</Text>
            <Text style={{fontSize: 13, color: '#7E7E7E'}}>{address}</Text>
        </TouchableOpacity>
    )
}

// use to: setAddress, setPostAddress, no
export default function MapSettingAddress({navigation, route}: any) {
    const dispatch = useDispatch();

    const {originalLocation, useTo, setOriginalLocation} = route.params

    const [inputSearch, setInputSearch] = useState('')
    const debouncedSearch = useDebounce(inputSearch, 500);
    const [dataSearch, setDataSearch] = useState<any[]>([])
    const [isFocusSearch, setIsFocusSearch] = useState(false)

    const [location, setLocation] = useState<any>(null);
    const [homeLocation, setHomeLocation] = useState<any>(null)

    const [isLoading, setIsLoading] = useState(false)


    const auth = useSelector(authSelector);
    const navitation = useNavigation()

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    useEffect(() => {
        const fetchHomeLocation = async () => {
            const response: any = await axiosClient.get(`${appInfo.BASE_URL}/user/get-user-address?userId=${auth.id}`)
            if(response.data !== null){
                setHomeLocation({
                    address: response.data.address,
                    latitude: parseFloat(response.data.latitude),
                    longitude: parseFloat(response.data.longitude)
                })
                moveCameraToCoordinate({
                    latitude: parseFloat(response.data.latitude),
                    longitude: parseFloat(response.data.longitude)
                })
            }else{
                let location: any = await ExpoLocation.getCurrentPositionAsync({});
                const locationTarget = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }
                setLocation(locationTarget)
                moveCameraToCoordinate(locationTarget)
            }
        }
        fetchHomeLocation()
        
    }, [])

    const handleSearch = () => {
        
        if(dataSearch.length > 0){
            const locationTarget = {
                latitude: parseFloat(dataSearch[0].lat),
                longitude: parseFloat(dataSearch[0].lon)
            }
            setLocation(locationTarget)
            setInputSearch(dataSearch[0].display_name)
            Keyboard.dismiss()
            moveCameraToCoordinate(locationTarget)
        }
    }

    const handleGetMyLocation = async () => {
        let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Quyền truy cập vào vị trí đã bị hoãn');
            return;
          }
    
          let location: any = await ExpoLocation.getCurrentPositionAsync({});
          const locationTarget = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
          setLocation(locationTarget)
          moveCameraToCoordinate(locationTarget)
    }

    const searchLocation = async (text: string) => {
        try {
            const response: any = await axiosClient.get(getUrlRequest(text));
            setDataSearch(response)
        } catch (error) {
            console.error('Lỗi khi tìm kiếm địa điểm:', error);
        }
    };

    useEffect(() => {
        searchLocation(debouncedSearch)
    }, [debouncedSearch])

    
    const handleChangeTextSearch = (text: string) => {
        setInputSearch(text)
    }

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

    const handleClickLocation = (lat: any, lon: any, display_name: any) => {
        const locationTarget = {
            latitude: lat,
            longitude: lon
        }
        setLocation(locationTarget)
        setInputSearch(display_name)
        Keyboard.dismiss()
        moveCameraToCoordinate(locationTarget)
    }

    const handleClear = () => {
        setInputSearch('')
    }

    const getCenterCoordinates = async () => {
        if (mapViewRef.current) {
          const region = await mapViewRef.current.getMapBoundaries();
          const centerLat = (region.northEast.latitude + region.southWest.latitude) / 2;
          const centerLng = (region.northEast.longitude + region.southWest.longitude) / 2;
          return { latitude: centerLat, longitude: centerLng };
        }
        return null;
    };

    const getAddressFromLatLng = async (lat: any, lng: any) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
        const data = await response.json();
        if (data && data.display_name) {
          return data.display_name
        } 
      };
    
    const handleGetCenterMyLocation = async () => {
        const center = await getCenterCoordinates();
        if (center) {
            
            // Sử dụng vị trí ở giữa bản đồ ở đây

            
            try {
                setIsLoading(true)
                const address = await getAddressFromLatLng(center.latitude, center.longitude)
                const response: any = await axiosClient.post(`${appInfo.BASE_URL}/map/set_user_location`,{
                    userID: auth.id,
                    latitude: center.latitude,
                    longitude: center.longitude,
                    address: address
                })
                dispatch(updateAuth({address}));

                setIsLoading(true)
                Alert.alert('Thông báo', 'Xác nhận vị trí thành công!')
                navitation.goBack()
            } catch (error) {
                console.error(error)
            }
            
            
        }
    };
    

    const handleGetCenterGiveLocation = async () => {
        const center = await getCenterCoordinates();
        if (center) {
            
            // Sử dụng vị trí ở giữa bản đồ ở đây

            
            try {
                setIsLoading(true)
                const address = await getAddressFromLatLng(center.latitude, center.longitude)
                setOriginalLocation({
                    latitude: center.latitude,
                    longitude: center.longitude,
                    address: address
                })
                setIsLoading(true)
                Alert.alert('Thông báo', 'Xác nhận vị trí cho thành công!')
                setInputSearch('')
                navitation.goBack()
            } catch (error) {
                console.error(error)
            }
            
            
        }
    }

    useEffect(() => {
        if(useTo === 'setAddress' && homeLocation){
            moveCameraToCoordinate(homeLocation)
        }
    }, [homeLocation])
    
    useEffect(() => {
        if(useTo === 'setPostAddress' || useTo === 'no'){
            moveCameraToCoordinate(originalLocation)
        }
    }, [])

    return (
        <ContainerComponent back title='Cài đặt vị trí của bạn'>
      
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
                        homeLocation !== null &&
                        <Marker
                            coordinate={{
                                latitude: homeLocation.latitude,
                                longitude: homeLocation.longitude
                            }}
                            title="Vị trí nhà của bạn"

                        >
                            <FontAwesome name='home' color={"#4A7FD3"} size={30}/>
                        </Marker>
                    }
                </MapView>
                
                <View style={styles.containerSearch}>
                    <View style={styles.search}>

                        {   
                            inputSearch.length > 0 &&
                            <TouchableOpacity style={styles.clearButton}
                                onPress={() => handleClear()}>
                                <MaterialIcons name='clear' size={25} color="white"/>
                            </TouchableOpacity>
                        }

                        <TextInput
                            style={styles.inputSearch}
                            value={inputSearch}
                            onChangeText={handleChangeTextSearch}
                            placeholder='Tìm kiếm...'
                            onSubmitEditing={() => handleSearch()}
                            onFocus={() => setIsFocusSearch(true)}
                            onBlur={() => setIsFocusSearch(false)}/>

                        <TouchableOpacity style={styles.searchButton}
                            onPress={() => handleSearch()}>
                            <EvilIcons name='search' size={25} color="white"/>
                        </TouchableOpacity>
                    </View>
                    {
                        isFocusSearch &&
                        <ScrollView style={styles.searchResults}
                            keyboardShouldPersistTaps={'always'}>
                            <View>
                                {
                                    dataSearch.map((data: any, index) => {
                                        return (
                                            <TouchableOpacity
                                            onPress={() => handleClickLocation(parseFloat(data.lat), parseFloat(data.lon), data.display_name)}
                                            key={index}>
                                                <LocationComponent name={data.name} address={data.display_name} handleClick={() => handleClickLocation(parseFloat(data.lat), parseFloat(data.lon), data.display_name)}/>
                                                
                                                {
                                                    index < dataSearch.length - 1 &&
                                                    <View style={{width: '100%', height: 1, backgroundColor: '#C5C5C5'}}></View>
                                                }
                                                
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            
                            
                        </ScrollView>
                    }
                    
                </View>

                <TouchableOpacity style={styles.getMyLocation}
                    onPress={handleGetMyLocation}>
                    <EvilIcons name='location' size={35} color='white'/>
                </TouchableOpacity>

                {
                    (useTo === 'setAddress')
                    &&
                    <ButtonComponent
                        disable={false}
                        onPress={() => handleGetCenterMyLocation()}
                        text={"Xác nhận vị trí của tôi"}
                        type='primary'
                        iconFlex="right"
                        styles={styles.myLocationButton}
                    />
                }

                {
                    (useTo === 'setPostAddress')
                    &&
                    <ButtonComponent
                        disable={false}
                        onPress={() => handleGetCenterGiveLocation()}
                        text={"Xác nhận vị trí cho"}
                        type='primary'
                        iconFlex="right"
                        styles={styles.myLocationButton}
                    />
                }
                

                <View style={styles.pinLocation}>
                    <MaterialIcons 
                        name='location-pin' 
                        size={50} 
                        style={{color: appColors.primary}}
                    />
                </View>
                
            </KeyboardAvoidingView>
            
            <LoadingModal visible={isLoading}/>
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
    containerSearch: {
        width: '95%',
        position: 'absolute',
        top: 10,
        flexDirection: 'column'
    },
    search: {
        backgroundColor: "#ffffff",
        color: "red",
        borderRadius: 30,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 8,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        
    },
    searchResults: {
        width: '100%',
        maxHeight: 300,
        backgroundColor: 'white',
        zIndex: 1,
        borderRadius: 10,
        marginTop: 5
    },
    inputSearch: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    searchButton: {
        width: 55,
        height: 55,
        backgroundColor: appColors.primary,
        marginRight: 2,
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:'white',
        borderWidth: 1
    },
    clearButton: {
        width: 55,
        height: 55,
        backgroundColor:"#641620",
        marginLeft: 2,
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:'white',
        borderWidth: 1
    },
    myLocationButton: {
        position: 'absolute',
        backgroundColor: appColors.primary,
        color: "red",
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 8,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 0
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
    }
})