import { StyleSheet, View, Modal, TouchableWithoutFeedback, Alert, Dimensions } from 'react-native';
import React from 'react';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ShowImageModal = ({ visible, setVisible, children }: any) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          { children }
        </View>
      </View>
    </Modal>
  );
}

export default ShowImageModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: windowWidth, // Chiều rộng là 70% của màn hình
    height: windowHeight * 0.5, // Chiều cao tùy ý
    backgroundColor: '#fff', // Màu nền của modal
    borderTopLeftRadius: 20, // Độ cong góc trên bên trái
    borderTopRightRadius: 20, // Độ cong góc trên bên phải
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: windowWidth * 0.8,
    height: windowWidth * 0.8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
