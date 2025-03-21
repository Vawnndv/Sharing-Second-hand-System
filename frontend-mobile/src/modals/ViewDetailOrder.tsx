import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { Platform, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Text, View } from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
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
import { appColors } from '../constants/appColors';
import { appInfo } from '../constants/appInfos';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducers';
import postsAPI from '../apis/postApi';
import { ActivityIndicator } from 'react-native-paper';
import { statusOrder } from '../constants/statusOrder';
import { ContainerComponent, TextComponent } from '../components';
import RatingModal from './RatingModal';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native/dist/platform_react_native';
import { decode as jpegDecode } from 'jpeg-js';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem  from 'expo-file-system';
import ConfirmCategoryReceiveModal from './ConfirmCategoryReceiveModal';
import LoadingComponent from '../components/LoadingComponent';

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
  warehouseid: string,
  iswarehousepost: boolean,
  name: string,
  nametype: string
  itemid: string
}

export default function ViewDetailOrder({navigation, route}: any) {
  const {orderid} = route.params;


  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleConfirmCategory, setVisibleConfirmCategory] = useState(false)
  const [visibleRating, setVisibleRating] = useState(false)
  const [isShowQR, setIsShowQR] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [data, setData] = useState<Data>();

  const modelURL = 'https://teachablemachine.withgoogle.com/models/5tKZ1qkgC/';
  const [labels, setLabels] = useState<string[]>([]);


  const [model, setModel] = useState<any>(null);
  const [currentCategory, setCurrentCategory] = useState('')

  const loadModel = async () => {
    try {
      await tf.ready();  
      setModel(await tf.loadLayersModel(modelURL + 'model.json'));
      const response: any = await fetch(modelURL + 'metadata.json');
      if (!response.ok) {
        throw new Error('Failed to fetch labels of model');
      }
      const metadata = await response.json();
      setLabels(metadata.labels);   

    } catch (error) {
      console.error('Error loading the model', error);
    }
  };

  // const navigation: any = useNavigation();

  const auth = useSelector(authSelector);
  const userID = auth.id;

  useEffect(function(){
    setIsLoading(true)
    getOrderDetails()
    loadModel();
    setIsLoading(false)
  }, []);

  useEffect(function(){
    !modalConfirmVisible && 
    getOrderDetails()
  }, [modalConfirmVisible]);


  const imageToTensor = async (rawImageData: any) => {
    try {
      if(rawImageData){
        // setIsLoading(true);
        
        const fileUri = rawImageData.uri;
        const fileData = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
        const rawImageDataArray = Uint8Array.from(Buffer.from(fileData, 'base64'));
        const { width, height, data } = jpegDecode(rawImageDataArray, { useTArray: true });
  
        const buffer = new Uint8Array(width * height * 3);
        let offset = 0;
        for (let i = 0; i < buffer.length; i += 3) {
          buffer[i] = data[offset];
          buffer[i + 1] = data[offset + 1];
          buffer[i + 2] = data[offset + 2];
          offset += 4;
        }
  
        // Normalize the tensor
        const tensor = tf.tensor3d(buffer, [height, width, 3]).resizeBilinear([224, 224]).div(tf.scalar(255));
        // const tensor = tf.tensor3d(buffer, [height, width, 3]);
  
        return tensor;
      }
  
    } catch (error) {
      console.log("Error converting image to tensor:", error);
    }
  }
  
  const predictImage = async (imageUri: any) => {
    try {
      if(imageUri){
        setIsLoadingUpload(true);
        // Chuyển đổi hình ảnh thành tensor
        const imageTensor = await imageToTensor(imageUri);
        if (!imageTensor) {
          throw new Error('Failed to convert image to tensor');
        }
  
        // Thêm batch dimension để tensor phù hợp với đầu vào của mô hình
        const expandedTensor = imageTensor.expandDims(0);
  
        // Dự đoán hình ảnh sử dụng mô hình
        const predictionTensor = await model.predict(expandedTensor);
        if (!predictionTensor) {
          throw new Error('Failed to make prediction');
        }
  
        // Lấy giá trị dự đoán từ tensor
        const predictionArray = await predictionTensor.array();
        const maxProbabilityIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
  
  
  
        // Lấy nhãn tương ứng từ mảng nhãn
        let predictedLabel = labels[maxProbabilityIndex];
  
        // Tạo đối tượng kết quả dự đoán chỉ với dự đoán có xác suất cao nhất
        const predictionResult = {
          label: predictedLabel,
          probability: Math.max(...predictionArray[0])
        };
        setIsLoadingUpload(false);

  
  
        return predictionResult;
      }
      else{
        setIsLoadingUpload(false);
  
      }
    } catch (error) {
      console.log('Error when predicting image:', error);
    }
  };

  useEffect(() => {
    const handlePredict = async () => {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      const prediction: any = await predictImage({ uri: manipulatedImage.uri }); // Dự đoán ảnh đã resize
  
      const [nameType, category] = prediction ? prediction?.label.split('-') : '';
      setCurrentCategory(category)
  
      if(category === 'Nhạy cảm' && prediction?.probability > 0.8){
        Alert.alert('Bạn không thể sử dụng ảnh này vì lý do: ', ' Ảnh được nhận diện là ảnh nhạy cảm');
        setVisibleConfirmCategory(true)
        return;
      }else if(category !== data?.nametype){
        setVisibleConfirmCategory(true)
        return;
      }else{
        setModalConfirmVisible(true);
      }
    }

    if(image !== null){
      try {
       handlePredict()
      } catch (error) {
        console.log(error)
      }
      
    }
  }, [image])

  

  const getOrderDetails = async () => {
    try {
      setIsLoading(true);
      const res = await orderAPI.HandleOrder(
        `/${orderid}`,
        'get'
      );
      setData(res.data)
      setIsLoading(false);
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
      // setIsModalVisible(false)
      // navigation.navigate('OrderReceive', { reload: true })
      navigation.goBack()
    } catch (error) {
      console.log(error);
    }
  };

  const cancelGiveOrder = async () => {
    try {
      setIsLoading(true);

      const res = await orderAPI.HandleOrder(
        `/update-status`,
        {
          orderID: orderid,
          statusID: statusOrder.CANCELED.statusid
        },
        'post'
      );
      
      setIsLoading(false);
      // setIsModalVisible(false)
      navigation.navigate('OrderGive', { reload: true })
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

  const handleConfirm = async () => {
    setImage(null)
    getPermission() 
    setModalVisible(true)
  };

  const handleCancel = async () => {
    deletePostReceiver()
  };

  const handleCancelGive = async () => {
    cancelGiveOrder()
  };

  const handleShowImage = () => {
    setVisible(true)
    setIsShowQR(false)
  }

  const handleShowQR = () => {
    setVisible(true)
    setIsShowQR(true)
  }

  const navigateToUserProfile = (userID: string) => {
    navigation.navigate(
      'ProfileScreen',
      {
        id: userID,
        // isNavigate
      },
    );
  }
  
  return (
    <ContainerComponent back title={data?.status}>
      {
        isLoading ? (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <LoadingComponent isLoading={isLoading} /> 
          </View>
        ) : (
          <View style={styles.body}>
            <LoadingModal visible={isLoadingUpload}/>
            <CardComponent
              color={appColors.white4}
              isShadow
              onPress={() => navigation.navigate('ItemDetailScreen', {
                postID : data?.postid,
              })}
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
                    {/* <Icon name="map-pin" size={20} color="#552466" /> */}
                    <SimpleLineIcons name="location-pin" size={14} color={appColors.black} />
                    <TextComponent styles={{ paddingLeft: 10 }} text={`${data?.address}`} numberOfLines={2}/>
                </View>

                <View style={{ paddingTop: 2, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}> {data?.status} </Text>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}> {formatDateTime(data ? data.statuscreatedat : '' )}</Text>
                </View>
              </View>
            </CardComponent>

            <View style={{flexDirection: 'row', margin: 15, marginVertical: 0}}>
              {
                userID == data?.userreceiveid ? (
                  data?.isreciever ? (
                    !(image || data?.imgconfirmreceive && data?.imgconfirmreceive != ' ') && 
                    <Button mode="contained" onPress={handleConfirm} buttonColor='red' style={{width: '40%', marginVertical: 10, borderRadius: 10}}>
                      Xác nhận
                    </Button>
                  ) : ( <></> )
                ) : (
                  userID == data?.usergiveid ? (
                    data?.status == statusOrder.AWAITING_APPROVAL.statusname &&
                    <Button mode="contained" onPress={handleCancelGive} buttonColor='red' style={{width: '40%', marginVertical: 10, borderRadius: 10}}>
                      Hủy cho
                    </Button>
                  ) : (
                    <Button mode="contained" onPress={handleCancel} buttonColor='red' style={{width: '40%', marginVertical: 10}}>
                      Hủy
                    </Button>
                  )
                )
              }
              {
                (image || data?.imgconfirmreceive && data?.imgconfirmreceive != ' ') && 
                <IconButton style={{marginVertical: 10}} icon="image" mode="outlined" onPress={handleShowImage}>
                </IconButton>
              }

              <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }}>
                <IconButton style={{marginVertical: 10}} icon="qrcode" mode="outlined" onPress={handleShowQR}>
                </IconButton>

                <View style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  flexGrow: 1,
                }}>
                  <TouchableOpacity style={{
                    padding: 10,
                    backgroundColor: appColors.primary,
                    borderRadius: 10
                  }}>
                     {
                      data && (
                        data.usergiveid == auth.id ?
                        <Text style={{color: 'white'}} onPress={() => navigateToUserProfile(data.userreceiveid)}>Thông tin người nhận</Text>
                        : 
                        <Text style={{color: 'white'}} onPress={() => navigateToUserProfile(data.usergiveid)}>Thông tin người cho</Text>
                      )
                    }
                  </TouchableOpacity>
                </View>
                
              </View>

              
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
              title='Chụp ảnh xác nhận'     
            />

          </View>
          )
        }
        {/* <Text style={styles.body}>Modal</Text> */}
        {/* <View style={styles.separator} /> */}

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        {data && <ConfimReceiveModal setModalConfirmVisible={setModalConfirmVisible} modalConfirmVisible={modalConfirmVisible}
      image={image} orderid={data.orderid} owner={data.usergiveid} warehouseID={data.warehouseid}
      isWarehousePost={data.iswarehousepost} auth={auth} name={data.name} visibleRatingModal={visibleRating} setVisibleRatingModal={setVisibleRating} itemid={data.itemid}/>}

        {data && <ConfirmCategoryReceiveModal setVisible={setVisibleConfirmCategory} visible={visibleConfirmCategory} setImage={setImage} 
        setVisibleConfirmReceiveModal={setModalConfirmVisible} categoryGive={data.nametype} currentCategory={currentCategory} />}
        <ShowImageModal visible={visible} setVisible={setVisible}>
          {
            isShowQR ? (
              <QRCodeGenerator data={ data ? data.orderid.toString() : ''}/>
            ) : (
              <Image source={{ uri: image ? image.uri : data?.imgconfirmreceive}} resizeMode="cover" style={{ width: '100%', height: '100%' }}/>
            )
          }
        </ShowImageModal>
        <RatingModal visible={visibleRating} setVisible={setVisibleRating} usergiveid={data?.usergiveid} orderid={data?.orderid}/>
      </ContainerComponent>
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
    flexDirection: 'column',
    gap: 5
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infomation: {
    width: '65%',
    justifyContent: 'space-between',
    paddingLeft: 10,
    marginVertical: 10,
    
  },
  image: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    width: '30%',
    height: '100%',
    objectFit: 'cover',
  },
  process: {
    height: appInfo.sizes.HEIGHT * 0.59,
    borderRadius: 5,
    borderColor: 'grey',
    borderWidth: 1,
    flexGrow: 1, // Thiết lập để mở rộng theo chiều cao
    margin: 15,
    marginTop: 0
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
