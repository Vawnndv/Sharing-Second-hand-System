import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { Platform, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, IconButton } from 'react-native-paper';
import StepIndicatorOrder from '../components/OrderManagement/StepIndicatorOrder';
import { formatDateTime } from '../utils/FormatDateTime';
import UploadModal from './UploadModal';
import { PickImage, TakePhoto, getCameraPermission, getGallaryPermission } from '../ImgPickerAndUpload';
import ConfimReceiveModal from './ConfimReceiveModal';
import ShowImageModal from './ShowImageModal';
import QRCodeGenerator from '../components/GenerateQRCode';
import orderAPI from '../apis/orderApi';
import LoadingModal from './LoadingModal';
import CardComponent from '../components/CardComponent';
import { useNavigation } from '@react-navigation/native';
import { appColors } from '../constants/appColors';
import { appInfo } from '../constants/appInfos';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducers';
import postsAPI from '../apis/postApi';

interface Data {
  title: string;
  address: string;
  givetype: string;
  status: string;
  image: string;
  orderid: string;
  statuscreatedat: string;
  imgconfirmreceive: string;
  usergiveid: string,
  userreceiveid: string,
  postid: string,
  isreciever: boolean,
}

export default function ViewDetailOrder({ setIsModalVisible, orderid }: { setIsModalVisible: (isVisible: boolean) => void, orderid: string }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isShowQR, setIsShowQR] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data>();

  const navigation: any = useNavigation();

  const auth = useSelector(authSelector);
  const userID = auth.id;

  useEffect(function(){
    getOrderDetails()
  }, []);

  const getOrderDetails = async () => {
    try {
      setIsLoading(true);

      const res = await orderAPI.HandleOrder(
        `/${orderid}`,
        'get'
      );
      
      setIsLoading(false);
      setData(res.data)
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostReceiver = async () => {
    try {
      setIsLoading(true);
      const res = await postsAPI.HandlePost(
        `/deletepostreceivers?postID=${data?.postid}&receiverID=${auth.id}`,
        '',
        'delete'
      );

      setIsLoading(false);
      setIsModalVisible(false)
      navigation.navigate('OrderReceive', { reload: true })
    } catch (error) {
      console.log(error);
    }
  };

  const removeImage = async () => {
    try {
      setModalVisible(false);
    } catch ({ message}: any) {
      alert(message);
      setModalVisible(false);
    }
  };

  const getPermission = async () => {
    await getCameraPermission(setHasCameraPermission);
    await getGallaryPermission(setHasGalleryPermission);
  }

  useEffect(()  => {
    image && setModalConfirmVisible(true)
  }, [image])

  const handleConfirm = async () => {
    setImage(null)
    getPermission() 
    setModalVisible(true)
  };

  const handleCancel = async () => {
    deletePostReceiver()
  };

  const handleShowImage = () => {
    setVisible(true)
    setIsShowQR(false)
  }

  const handleShowQR = () => {
    setVisible(true)
    setIsShowQR(true)
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={{ justifyContent: 'flex-start' }}>
          <Ionicons name="arrow-back" size={28}></Ionicons>
        </TouchableOpacity>
        <Text style={{flex: 1, textAlign: 'center', alignItems: 'center', fontSize: 18, fontWeight: 'bold'}}>{data?.status}</Text>
      </View>

      <View style={styles.body}>
        <CardComponent
          // key={index}
          color={appColors.white4}
          isShadow
          onPress={() => navigation.navigate('ItemDetailScreen')}
          styles={styles.info}
        >
          <Image
            source={{ uri: data?.image }} 
            style={styles.image} 
            resizeMode="contain"
          />

          <View style={styles.infomation}>
            <Text style={{ fontWeight: 'bold' }}>{data?.title}</Text>
            <View style={{ paddingTop: 2, flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="map-pin" size={20} color="#552466" />
                <Text style={{ paddingLeft: 20 }}>{data?.address}</Text>
            </View>

            <View style={{ paddingTop: 2, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}> {data?.status} </Text>
                <Text style={{ color: 'red', fontWeight: 'bold' }}> {formatDateTime(data ? data.statuscreatedat : '' )}</Text>
            </View>
          </View>
        </CardComponent>

        <View style={{flexDirection: 'row'}}>
          {
            // userID == data?.userreceiveid ? (
              userID == data?.userreceiveid && data?.isreciever ? (
                <Button mode="contained" onPress={handleConfirm} buttonColor='red' style={{width: '40%', marginVertical: 10}}>
                  Xác nhận
                </Button>

              ) : (
                <Button mode="contained" onPress={handleCancel} buttonColor='red' style={{width: '40%', marginVertical: 10}}>
                  Hủy
                </Button>
              )
            // ) : (<></>)
          }
          <IconButton style={{marginVertical: 10}} icon="image" mode="outlined" onPress={handleShowImage}>
          </IconButton>

          <IconButton style={{marginVertical: 10}} icon="qrcode" mode="outlined" onPress={handleShowQR}>
          </IconButton>
        </View>

        <View style={styles.process}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 3 }}>
            <View>
              <Text style={{ fontWeight: 'bold' }}>Quá Trình</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>Mã đơn hàng</Text>
              <Text style={{ paddingLeft: 5, fontWeight: 'bold', color: 'blue' }}>{data?.orderid}</Text>
            </View>
          </View>

          <View style={{borderBottomWidth: 1, marginTop: 4, borderBottomColor: 'grey'}}/>

          <ScrollView>
            {data && <StepIndicatorOrder orderID={data?.orderid}/>}
          </ScrollView>
        </View>
        <UploadModal 
          modalVisible={modalVisible}
          onBackPress={() => { setModalVisible(false); }}
          onCameraPress={() => TakePhoto(hasCameraPermission,setImage,() => setModalVisible(false))} 
          onGalleryPress={() => PickImage(hasGalleryPermission,false,setImage, () => setModalVisible(false))}
          onRemovePress={() => removeImage()}
          isLoading={false}
          title='Confirm photo'     
        />

      </View>
      {/* <Text style={styles.body}>Modal</Text> */}
      {/* <View style={styles.separator} /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      {data && <ConfimReceiveModal setModalConfirmVisible={setModalConfirmVisible} modalConfirmVisible={modalConfirmVisible} image={image} orderid={data.orderid}/>}
      <ShowImageModal visible={visible} setVisible={setVisible}>
        {
          isShowQR ? (
            <QRCodeGenerator data={ data ? data.orderid.toString() : ''}/>
          ) : (
            <Image source={{ uri: image ? image.uri : data?.imgconfirmreceive}} resizeMode="cover" style={{ width: '100%', height: '100%' }}/>
          )
        }
      </ShowImageModal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '10%',
    flexDirection: 'row',
    padding: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  container: {
    flex: 1
  },
  body: {
    margin: 15,
    flexDirection: 'column',
    gap: 5
  },
  info: {
    // borderRadius: 5,
    // borderColor: 'grey',
    // borderWidth: 1,
    // display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infomation: {
    width: '70%',
    justifyContent: 'space-between',
    paddingLeft: 10,
    marginVertical: 10
  },
  image: {
    width: 90,
    height: 90,
    objectFit: 'cover',
    borderRadius: 5,
    margin: 5
  },
  process: {
    height: appInfo.sizes.HEIGHT * 0.59,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
    flexGrow: 1, // Thiết lập để mở rộng theo chiều cao
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: 'red'
  },
});
