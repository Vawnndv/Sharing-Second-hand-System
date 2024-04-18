import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Dimensions } from "react-native";
import MapView, {Marker, PROVIDER_DEFAULT} from 'react-native-maps';

const { width, height } = Dimensions.get("window")

export default function ShowMapComponent({location, setLocation} : any) {


    const navigation: any = useNavigation();

    const initalPosition = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02 * width / height
    }
    
    console.log(width, height)
    return (
        <View style={styles.mapContainer}>
            <View style={[styles.wrapper, {}]}>
                <MapView
                    style={{width: '100%', height: '100%', borderRadius: 10}}
                    showsUserLocation={true}
                    provider={PROVIDER_DEFAULT}
                    initialRegion={initalPosition}>
                        <Marker
                            title={location.address}
                            coordinate={{latitude: initalPosition.latitude, longitude: initalPosition.longitude}}>
                            
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
        width: '95%',
        height: '95%',
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