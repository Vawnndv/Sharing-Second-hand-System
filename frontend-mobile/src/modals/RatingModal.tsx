import { Modal, StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { appColors } from "../constants/appColors";
import { appInfo } from "../constants/appInfos";
import { useState } from "react";
import axiosClient from "../apis/axiosClient";
import LoadingModal from "./LoadingModal";
import React from "react";

const RatingModal = ({visible, setVisible, usergiveid, orderid}: any) => {
    const [rate, setRate] = useState(4)
    const [isLoading, setIsLoading] = useState(false)

    const handleRating = async () => {
        try {
            setIsLoading(true)
            await axiosClient.post('/rating/insertRating', {
                userGiveID: usergiveid,
                orderID: orderid,
                rate: rate
            })
            setIsLoading(false)
            Alert.alert("Thông báo!", "Bạn đã đánh giá người dùng thành công!")
        } catch (error) {
            console.log(error)
        }
    }
    return (
    <>
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}>
            <View style={styles.container}>
                <View style={styles.modalView}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                        Xin vui lòng đánh giá người cho!
                    </Text>
                    <View>
                        <AirbnbRating
                            count={5}
                            size={30}
                            defaultRating={4}
                            onFinishRating={(rate: number) => setRate(rate)}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => setVisible(false)}
                            style={[ { borderRadius: 20,
                                paddingHorizontal: 20,
                                paddingVertical: 10, 
                                }]}>
                            <Text style={{color: '#ff0000', fontStyle: 'italic', textDecorationLine: 'underline'}}>
                                Để sau
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {setVisible(false), handleRating()}}
                            style={[styles.button, {backgroundColor: '#265598'}]}>
                            <Text style={{color: 'white'}}>
                                Xác nhận
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
            
            
        </Modal>
        <LoadingModal visible={isLoading} />
    </>
)
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    padding: 20,
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
    paddingVertical: 10
}
})

export default RatingModal;