import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';

import * as Location from 'expo-location';
import {Dimensions, View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView, Keyboard, KeyboardAvoidingView, Alert} from "react-native"
import ContainerComponent from '../../components/ContainerComponent';
import { useEffect, useRef, useState } from 'react';
import { EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'

import { useDebounce } from '../../hooks/useDebounce';


const GOOGLE_MAP_API_KEY = "AIzaSyAbk-Yxdn_arPK7y6BHG25BauJy4f-vppc"
const BING_MAP_API_KEY = "AkbbA9uPU7tvwlE1ASjaoNdewiGGUMD-jdDh4I_umwvjlb72eROt-JFTDzDApMCr"
const getUrlRequest = (query: string) => {
    return `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
}


const { width, height } = Dimensions.get("window")

const initalPosition = {
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

export default function Map() {

    const [inputSearch, setInputSearch] = useState('')
    const debouncedSearch = useDebounce(inputSearch, 500);
    const [dataSearch, setDataSearch] = useState<any[]>([])
    const [isFocusSearch, setIsFocusSearch] = useState(false)

    const [location, setLocation] = useState<any>(null);

    const handleSearch = () => {
        
        if(dataSearch.length > 0){
            console.log('handle search')
            const locationTarget = {
                latitude: parseFloat(dataSearch[0].lat),
                longitude: parseFloat(dataSearch[0].lon)
            }
            setLocation(locationTarget)
            setInputSearch(dataSearch[0].display_name)
            Keyboard.dismiss()
            moveCameraToCoordinate(locationTarget)
            console.log(locationTarget)
        }
    }

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

    const searchLocation = async (text: string) => {
        try {
            const response = await axios.get(getUrlRequest(text));
            setDataSearch(response.data)
        } catch (error) {
            console.error('Lỗi khi tìm kiếm địa điểm:', error);
        }
    };

    useEffect(() => {
        searchLocation(debouncedSearch)
    }, [debouncedSearch])

    
    const handleChangeTextSearch = (text: string) => {
        setInputSearch(text)
        // fetchAutoSuggest(text)
    }

    // dùng để di chuyển camera khi click vào 1 kết quả
    const mapViewRef = useRef<MapView>(null);

    const moveCameraToCoordinate = (locationTarget: any) => {
      const camera = {
        center: locationTarget,
        zoom: 15, // Level of zoom
      };
  
      // Move camera to the specified coordinate
      mapViewRef.current?.animateCamera(camera, { duration: 500 });
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
        // setIsFocusSearch(false)
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
    
      const handleGetCenter = async () => {
        const center =await getCenterCoordinates();
        if (center) {
          console.log('Center coordinates:', center);
          // Sử dụng vị trí ở giữa bản đồ ở đây
        }
      };

    
    return (
        <ContainerComponent>
      
            <KeyboardAvoidingView style={styles.container}>
                <MapView
                ref={mapViewRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={initalPosition}
                // showsUserLocation={true}
                userLocationAnnotationTitle="Your Location">
                    {/* {
                        location !== null &&
                        <Marker
                            coordinate={location}
                            title="Vị trí của tôi"
                        />
                    } */}
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

                <TouchableOpacity style={styles.myLocationButton}
                    onPress={() => handleGetCenter()}>
                    <Text style={{fontSize: 18, color: 'white'}}>Xác nhận vị trí của tôi</Text>
                </TouchableOpacity>

                <View style={styles.pinLocation}>
                    <Ionicons name='location' size={50} style={{color: '#693F8B'}}/>
                </View>
                
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
    containerSearch: {
        width: '95%',
        position: 'absolute',
        top: 20,
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
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    searchButton: {
        width: 45,
        height: 45,
        backgroundColor:"#693F8B",
        marginRight: 2,
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:'white',
        borderWidth: 1
    },
    clearButton: {
        width: 45,
        height: 45,
        backgroundColor:"#641620",
        marginRight: 2,
        borderRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:'white',
        borderWidth: 1
    },
    myLocationButton: {
        position: 'absolute',
        width: '95%',
        backgroundColor: "#693F8B",
        color: "red",
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 8,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        bottom: 10,
        paddingVertical: 15,
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
        backgroundColor: '#693F8B',
        borderRadius: 100,
    },
    pinLocation: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -50 }],
    }
})