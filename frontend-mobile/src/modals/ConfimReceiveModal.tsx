import { StyleSheet, Text, View, Modal, Pressable, Image } from 'react-native'
import React, {useState} from 'react'
import { appColors } from '../constants/appColors';
import { Button } from 'react-native-paper';
import orderAPI from '../apis/orderApi';
import { UploadImageToAws3 } from '../ImgPickerAndUpload';
import LoadingModal from './LoadingModal';
import { appInfo } from '../constants/appInfos';

interface Props {
  setModalConfirmVisible: any;
  modalConfirmVisible: any;
  image: any;
  orderid: any;
}

const ConfimReceiveModal = (props: Props) => {
  const { setModalConfirmVisible, modalConfirmVisible, image, orderid } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    const {url} = await UploadImageToAws3(image);
    try {
      const res = await orderAPI.HandleOrder('/upload-image-confirm', 
      {
        orderid: orderid,
        imgconfirmreceive: url
      }
      , 'post');
      setIsLoading(false);
      setModalConfirmVisible(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message)
      } else {
        console.log("Network Error");
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        animationType='slide'
        visible={modalConfirmVisible}
        transparent={true}
      >
        <Pressable
          style={localStyles.container}
          onPress={() => { setModalConfirmVisible(false) }}
        >
          <View style={[localStyles.modalView, { backgroundColor: appColors.white }]}>
            {image && (
              <Image source={{ uri: image.uri }} style={localStyles.image} />
            )}
            <Button
              mode="contained"
              style={localStyles.confirmButton}
              onPress={handleConfirm}
            >
              Xác nhận
            </Button>
          </View>
        </Pressable>
      </Modal>
      <LoadingModal visible={isLoading} />
    </>
  )
}

export default ConfimReceiveModal

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Custom modal background color
  },
  modalView: {
    margin: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  decisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  optionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.gray5,
    width: 65,
    height: 65,
    borderRadius: 10,
  },
  image: {
    width: appInfo.sizes.WIDTH - 100,
    height: appInfo.sizes.HEIGHT - 400,
    marginBottom: 10,
  },
  confirmButton: {
    marginTop: 10,
    color: appColors.danger
  },
});
