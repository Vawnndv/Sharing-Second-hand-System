import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Dimensions } from "react-native";
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';
import { fontFamilies } from "../constants/fontFamilies";
import * as Location from 'expo-location';
import haversine  from 'haversine'
import { useEffect, useState } from "react";

const { width, height } = Dimensions.get("window")

export default function ShowMapComponent({location, setLocation} : any) {


    const [distance, setDistance] = useState(0)

    const navigation: any = useNavigation();

    const initalPosition = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02 * width / height
    }

    const getHowFarAway = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return 0;
        }

        let currentLocationResult: any = await Location.getCurrentPositionAsync({});
    //   console.log(location)
        const currentLocation = {
            latitude: currentLocationResult.coords.latitude,
            longitude: currentLocationResult.coords.longitude
        }

        const targetLocation = {
            latitude: location.latitude,
            longitude: location.longitude
        }

        return haversine(currentLocation, targetLocation, { unit: 'meter' });
    }

    useEffect(() => {
        const fetchData = async () => {
            const distance = await getHowFarAway();
            setDistance(Math.round(distance));
            console.log(distance)
        };

        fetchData()
    }, [])
    
    
    // console.log(width, height)
    return (
        <View style={styles.mapContainer}>
            <View style={[styles.wrapper, {}]}>
                <View style={{display: 'flex', flexDirection: 'row', width: '100%', marginBottom: 2}}>
                    <Text style={{fontFamily: fontFamilies.medium, flex: 1}}>Khoảng cách ước tính: </Text>
                    <Text style={{fontFamily: fontFamilies.medium}}>{distance}m</Text>
                </View>
                <MapView
                    style={{width: '100%', height: '100%', borderRadius: 10}}
                    showsUserLocation={true}
                    provider={PROVIDER_DEFAULT}
                    initialRegion={initalPosition}>
                        <Marker
                            title={location.address}
                            coordinate={{latitude: location.latitude, longitude: location.longitude}}>
                            
                                <Ionicons name='location' size={50} style={{color: '#693F8B'}}/>
                            
                        </Marker>
                </MapView>

                <TouchableOpacity
                    style={styles.buttonNavigateMap}
                    onPress={() => navigation.navigate('MapSettingAddressScreen')}>
                    <Text style={{color: 'white'}}>Chọn trên bản đồ</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    )
}  

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        position: 'relative'
    },
    buttonNavigateMap: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: "#693F8B",
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 8,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 0
    }
})