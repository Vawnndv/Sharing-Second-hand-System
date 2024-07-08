import { useState } from "react";
import { Alert, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, Text, View } from "react-native";
import { appColors } from "../constants/appColors";
import { appInfo } from "../constants/appInfos";
import LoadingModal from "./LoadingModal";
import axiosClient from "../apis/axiosClient";
import React from "react";import { TextInput } from "react-native-paper";
import dayjs from "dayjs";
import moment from "moment";

interface Props {
    visible: boolean,
    setVisible: any,
    refreshData: boolean,
    setRefreshDate: any
}

export default function PostOutdatedModal(props: Props) {
    
    const {visible, setVisible, refreshData, setRefreshDate} = props;
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false); 
    const minimumDate = new Date()
    minimumDate.setDate(minimumDate.getDate() + 1)

    const [endDate, setEndDate] = useState(minimumDate)

    const onChangeStartDate = (event: any, selectedDate: any) => {
        const currentDate = selectedDate ? selectedDate : endDate;
        setStartDatePickerVisibility(false);
        setEndDate(currentDate);
    
    };

    const handleConfirm = () => {

    }

    const handleDeletePost = () => {
        
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
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                                Bài viết của bạn hiện đang hết hạn. Xin vui lòng gia hạn bài viết để người khác có thể nhìn thấy bài viết này!
                            </Text>
                            <TouchableOpacity onPress={() => setStartDatePickerVisibility(true)}>
                                <TextInput
                                    style={{
                                        width: '100%',
                                        marginBottom: 20,
                                        backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
                                        fontSize: 14,
                                    }}
                                    label="Ngày kết thúc"
                                    value={endDate ? moment(endDate).format('DD-MM-YYYY') : ''} // Hiển thị ngày được chọn dưới dạng YYYY-MM-DD
                                    // onBlur={() => handleValidate(formData.postEndDate,'postenddate')}
                                    editable={false} // Người dùng không thể chỉnh sửa trực tiếp
                                    // error={errorMessage.postEndDate? true : false}
                                    theme={{
                                        colors: {
                                        error: appColors.danger, 
                                        },
                                    }}
                                /> 

                            </TouchableOpacity>
                            
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)}>
                                    <Text style={{ color: '#433200' }}>Để sau</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, {backgroundColor: 'red'}]}
                                    onPress={() => handleDeletePost()}>
                                    <Text style={{ color: 'white' }}>Hủy bài viết</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button}
                                    onPress={() => handleConfirm()}>
                                    <Text style={{ color: 'white' }}>Xác nhận</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
            {isStartDatePickerVisible && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={endDate ? endDate : new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    minimumDate={minimumDate} // Đặt ngày tối thiểu có thể chọn cho DatePicker
                    maximumDate={endDate ? moment(endDate).toDate() : moment().add(2, 'months').toDate()} // Đặt ngày tối đa có thể chọn cho DatePicker
                    onChange={onChangeStartDate}
                />
            )}
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
        marginHorizontal: 5,
        backgroundColor: appColors.primary2,
    }
});
