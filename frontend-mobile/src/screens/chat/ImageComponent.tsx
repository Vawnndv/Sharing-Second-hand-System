import React, { useState } from 'react';
import { Image, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ImageComponent = ({ uri }: any) => {
  const [imageSize, setImageSize] = useState({ width: wp(50), height: wp(50) });
  const [isModalVisible, setModalVisible] = useState(false);

  // Lấy kích thước gốc của ảnh bằng phương thức Image.getSize()
  Image.getSize(uri, (width, height) => {
    const aspectRatio = width / height;
    const newWidth = wp(50);
    const newHeight = newWidth / aspectRatio;
    setImageSize({ width: newWidth, height: newHeight });
  });

  const toggleModal = () => {
    console.log('PESS CLOESE')
    setModalVisible(!isModalVisible);
  };

  return (
    <View>
      {/* Hình ảnh và tính năng bấm để mở modal */}
      <TouchableOpacity onPress={() => toggleModal()}>
        <Image
          source={{ uri }}
          style={{
            width: imageSize.width,
            height: imageSize.height,
            resizeMode: 'cover',
          }}
        />
      </TouchableOpacity>

      {/* Modal chứa ảnh được phóng to */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => toggleModal()}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {/* Nút đóng modal */}
          <View style={{display: 'flex', justifyContent: 'flex-start'}}>
            <TouchableOpacity style={{marginTop: hp(10), marginLeft: wp(80)}} onPress={() => toggleModal()}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          
          {/* Hình ảnh trong modal */}
          <Image
            source={{ uri }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white'
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

export default ImageComponent;
