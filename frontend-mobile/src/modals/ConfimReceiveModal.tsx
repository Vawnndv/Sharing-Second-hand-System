import { StyleSheet, Text, View, Modal, Pressable, Image } from 'react-native'
import React, {useState} from 'react'
import { appColors } from '../constants/appColors';
import { Button } from 'react-native-paper';
import orderAPI from '../apis/orderApi';
import { UploadImageToAws3 } from '../ImgPickerAndUpload';
import LoadingModal from './LoadingModal';
import { appInfo } from '../constants/appInfos';
import { HandleNotification } from '../utils/handleNotification';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducers';
import axios from 'axios';
import axiosClient from '../apis/axiosClient';

interface Props {
  setModalConfirmVisible: any;
  modalConfirmVisible: any;
  image: any;
  orderid: any;
  owner: any,
  isWarehousePost: boolean,
  warehouseID: string,
  auth: any,
  name: string
}

const ConfimReceiveModal = (props: Props) => {
  const { setModalConfirmVisible, modalConfirmVisible, image, orderid, owner, isWarehousePost, warehouseID, auth, name } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    const {url} = await UploadImageToAws3(image, false);
    try {
      const res = await orderAPI.HandleOrder('/upload-image-confirm', 
      {
        orderid: orderid,
        imgconfirmreceive: url
      }
      , 'post');

      if( isWarehousePost ){
        const resGetCollab:any = await axiosClient.post(`${appInfo.BASE_URL}/collaborator/collaborator-list/byWarehouse`, {
          warehouseID
        })
        resGetCollab.data.collaborators.map(async (collab: any, index: number) => {
          await HandleNotification.sendNotification({
            userReceiverId: collab.userid,
            userSendId: auth.id,
            name: `${auth?.firstName} ${auth.lastName}`,
            // postid: postID,
            avatar: auth.avatar,
            link: `order/${orderid}`,
            title: 'Đã xác nhận nhận đồ',
            body:`đã xác nhận nhận món đồ "${name}". Nhấn vào để xem thông tin cho tiết!`
          })
        })
      }else{
        await HandleNotification.sendNotification({
          userReceiverId: owner,
          userSendId: auth.id,
          name: `${auth?.firstName} ${auth.lastName}`,
          // postid: postID,
          avatar: auth.avatar,
          link: `order/${orderid}`,
          title: 'Đã xác nhận nhận đồ',
          body:`đã xác nhận nhận món đồ "${name}". Nhấn vào để xem thông tin cho tiết!`
        })
      }

      

      
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
    paddingVertical: 10,
    paddingHorizontal: 10,
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
    width: appInfo.sizes.WIDTH - 50,
    height: appInfo.sizes.WIDTH - 150,
    marginBottom: 10,
  },
  confirmButton: {
    marginTop: 10,
    color: appColors.danger
  },
});
