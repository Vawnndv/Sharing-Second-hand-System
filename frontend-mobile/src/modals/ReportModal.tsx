import { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Modal, Text, View } from "react-native";
import { appColors } from "../constants/appColors";
import { appInfo } from "../constants/appInfos";
import LoadingModal from "./LoadingModal";
import axiosClient from "../apis/axiosClient";
import React from "react";

export default function ReportModal({ visible, setVisible, title, reportType, userID, postID, reporterID, warehouseID }: any) {
    
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const handleReport = async () => {
        try {
            setIsLoading(true)
            const response: any = await axiosClient.post(`${appInfo.BASE_URL}/report`,{
                userID,
                postID,
                description,
                reportType,
                reporterID,
                warehouseID
            })
            if(response.data === true){
                setVisible(false)
                Alert.alert("Thông báo", "Bạn đã báo cáo thành công!")
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                Alert.alert('Đã ẩn báo cáo.');
                setVisible(!visible);
            }}
        >
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 15 }}>
                                Bạn đang báo cáo về {reportType === 1 ? 'người dùng ' : 'bài viết '} 
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text> !
                            </Text>
                            <Text style={{ fontSize: 15 }}>
                                Xin vui lòng mô tả thông tin chi tiết về phản hồi của bạn!
                            </Text>
                            <TextInput
                                editable
                                multiline
                                numberOfLines={4}
                                onChangeText={text => setDescription(text)}
                                value={description}
                                style={styles.description}
                                selectionColor='#9E9E9E'
                                cursorColor={"black"}
                            />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)}>
                                    <Text style={{ color: 'red' }}>Hủy bỏ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}
                                    onPress={() => handleReport()}>
                                    <Text style={{ color: 'white' }}>Gửi phản hồi</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
            <LoadingModal visible={isLoading} />
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#ffffff',
    },
    description: {
        borderColor: '#A3A3A3',
        borderWidth: 1,
        borderRadius: 5,
        color: 'black',
        padding: 5,
        marginVertical: 10,
        textAlignVertical: 'top', // Đặt văn bản luôn ở đầu đoạn input
        fontSize: 15
    },
    buttonContainer: {
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'flex-end',
    },
    cancelButton: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: appColors.primary2,
    }
});
