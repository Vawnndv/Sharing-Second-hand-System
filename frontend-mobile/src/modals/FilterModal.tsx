import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Modal, Alert, TouchableWithoutFeedback } from "react-native";
import FilterComponent from "../components/FilterComponent";
import React from "react";

export default function FilterModal({visible, setVisible, hideModal, showModal, filterValue, setFilterValue}: any) {
    // const [visible, setVisible] = useState(false);

    // const showModal = () => setVisible(true);
    // const hideModal = () => setVisible(false);

    return (
        <View style={styles.container}>
            <View style={styles.modal}>
                <Modal
                    onDismiss={hideModal}
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => {
                        Alert.alert('Đã ẩn bộ lọc.');
                        setVisible(!visible);
                    }}>
                        <TouchableWithoutFeedback
                            onPress={hideModal}>
                            <View style={styles.overlay}>
                                
                            </View>
                        </TouchableWithoutFeedback>
                        <FilterComponent hideModal={hideModal} filterValue={filterValue} setFilterValue={setFilterValue}/>
                </Modal>
            </View>
            {/* <TouchableOpacity
                onPress={showModal}>
                <Text>
                    Open modal
                </Text>
            </TouchableOpacity> */}
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute'
    },
    modal: {
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu làm mờ và độ trong suốt
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
})