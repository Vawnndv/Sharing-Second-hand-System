import { Modal, StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { appColors } from "../constants/appColors";
import { appInfo } from "../constants/appInfos";
import { useState } from "react";
import axiosClient from "../apis/axiosClient";
import LoadingModal from "./LoadingModal";

interface Props {
    setVisible: any;
    visible: any;
    setImage: any;
    setVisibleConfirmReceiveModal: any;
    categoryGive: string;
    currentCategory: string;
  }

const ConfirmCategoryReceiveModal = (props: Props) => {
    const {visible, setVisible, categoryGive, currentCategory, setVisibleConfirmReceiveModal, setImage} = props
    return (
    <>
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}>
            <View style={styles.container}>
                <View style={styles.modalView}>
                    <Text style={{fontSize: 15}}>
                        {`Hệ thống nhận diện được rằng hình ảnh xác nhận đơn hàng có loại đồ dùng là `}
                        <Text style={{fontWeight: 'bold'}}>
                            "{currentCategory}"
                        </Text>{`, khác loại với đồ dùng của đơn hàng `}
                        <Text style={{fontWeight: 'bold'}}>
                            "{categoryGive}"
                        </Text>
                    </Text>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => {setVisible(false), setImage(null)}}
                            style={[ { borderRadius: 20,
                                paddingHorizontal: 20,
                                paddingVertical: 10, 
                                }]}>
                            <Text style={{color: '#ff0000', fontStyle: 'italic', textDecorationLine: 'underline'}}>
                                Chọn ảnh khác
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {setVisible(false), setVisibleConfirmReceiveModal(true)}}
                            style={[styles.button, {backgroundColor: '#265598'}]}>
                            <Text style={{color: 'white'}}>
                                Vẫn xác nhận
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
            
            
        </Modal> 
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

export default ConfirmCategoryReceiveModal;