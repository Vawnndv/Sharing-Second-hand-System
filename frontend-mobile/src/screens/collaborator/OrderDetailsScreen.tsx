import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import { useEffect, useState } from "react";
import { appInfo } from "../../constants/appInfos";
import moment from "moment";
import { authSelector } from "../../redux/reducers/authReducers";
import { useSelector } from "react-redux";
import { ContainerComponent, TextComponent } from "../../components";
import { LoadingModal } from "../../modals";
import * as ImagePicker from "expo-image-picker"
import { getGallaryPermission, getCameraPermission, TakePhoto, PickImage, UploadImageToAws3, uploadImage } from "../../ImgPickerAndUpload"
import ConfirmComponent from "../../components/ConfirmComponent";
import { Alert } from "react-native";
import ShowMapComponent from "../../components/ShowMapComponent";
import { appColors } from "../../constants/appColors";
import axiosClient from "../../apis/axiosClient";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native/dist/platform_react_native';
import { decode as jpegDecode } from 'jpeg-js';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem  from 'expo-file-system';
import ConfirmCategoryReceiveModal from "../../modals/ConfirmCategoryReceiveModal";
import RatingModal from "../../modals/RatingModal";
import { current } from "@reduxjs/toolkit";
import React from "react";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function OrderDetailsScreen({navigation, route}: any) {

    const auth = useSelector(authSelector)
    
    const {orderID, status, handleRefresh} = route.params

    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
    const [hasCameraPermission, setHasCameraPermission] = useState(false)

    const [image, setImage] = useState<any>(null)

    const [isVisibleModalConfirm, setIsVisibleModalConfirm] = useState(false)
    const [confirm, setConfirm] = useState(false)

    const modelURL = 'https://teachablemachine.withgoogle.com/models/5tKZ1qkgC/';
    const [labels, setLabels] = useState<string[]>([]);


    const [model, setModel] = useState<any>(null);
    const [currentCategory, setCurrentCategory] = useState('')

    const [visibleConfirmCategory, setVisibleConfirmCategory] = useState(false)
    const [visibleRating, setVisibleRating] = useState(false)

    const [visibleModalConfirm, setVisibleModalConfirm] = useState(false)


    const loadLabels = () => {
        const metadata = require('../../../assets/model/metadata.json');
        if (metadata && metadata.labels) {
        setLabels(metadata.labels);
        }
    };

    const loadModel = async () => {
        try {
        await tf.ready();  
        setModel(await tf.loadLayersModel(modelURL + 'model.json'));
        console.log('model Loaded !!!!!');

        } catch (error) {
        console.error('Error loading the model', error);
        }
    };

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
            setIsLoading(true);
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
            console.log('predict Result: ', predictionResult.label + ' ' + predictionResult.probability);
            setIsLoading(false);
    
      
      
            return predictionResult;
          }
          else{
            setIsLoading(false);
      
          }
        } catch (error) {
          console.log('Error when predicting image:', error);
        }
      };

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
        }
    }

    useEffect(() => {
        const completeOrder = async () => {
            if(visibleRating){
                const data = await UploadImageToAws3(image, false);
                // const urlConfirm = response.url
                await axiosClient.put(`${appInfo.BASE_URL}/updateCompleteOrder/${orderID}`,{
                    url: data.url
                });
        
                await axiosClient.post(`${appInfo.BASE_URL}/order/update-status`,{
                    orderID: orderID,
                    statusID: 9
                });
        
                if(orders[0].order.giveTypeID === 5){
                    await axiosClient.post(`${appInfo.BASE_URL}/order/update-status`,{
                        orderID: orderID,
                        statusID: 3
                    });
                }
                if(handleRefresh){
                    handleRefresh()
                }
                
                Alert.alert('Thông báo','Xác nhận đơn hàng thành công!')
                navigation.goBack();
    
            }
        }
        completeOrder()
        
    }, [visibleRating])

    const handleConfirm = async () => {
        if(image !== null){
            setIsLoading(true);
            if(!visibleRating){
                console.log(orders[0].order.item.nametype + '-' +currentCategory)
                if(orders[0].order.item.nametype !== currentCategory){
                    // console.log(orders[0].order.giver.userID)
                    setVisibleConfirmCategory(true)
                }else{
                    setVisibleRating(true)
                }
            }
            
            setIsLoading(false);
            
        }else{
            Alert.alert('Thông báo','Bạn phải thêm ảnh xác nhận đơn hàng!')
            setIsLoading(false);
        }
        
    }

    const receiveOrder = async () => {
        
        setIsVisibleModalConfirm(true)
    }

    // khi mà người dùng xác nhận giao hàng thì thực hiện cập nhật dữ liệu
    const updateReceiver = async () => {
        const collabID = status === 'Chờ cộng tác viên lấy hàng' ? auth.id : null
        const statusOrder = status === 'Chờ cộng tác viên lấy hàng' ? 'Hàng đang được đến lấy' : 'Chờ cộng tác viên lấy hàng'
        await axiosClient.post(`${appInfo.BASE_URL}/order/update-status`,{
            orderID: orderID,
            statusID: 11
        });
        const response: any = await axiosClient.put(`${appInfo.BASE_URL}/updatePinOrder/${orderID}`,{
            collaboratorReceiveID: collabID
        });
        if(response.statusPin === false){
            Alert.alert('Thông báo','Đơn hàng đã được người khác chọn!')
        }else{
            Alert.alert('Thông báo','Chọn đơn hàng thành công!')
        }
        navigation.goBack();
    }
    
    useEffect(() => {
        if(confirm === true) {
            if(handleRefresh){
                handleRefresh()
            }
            updateReceiver()
        }
    }, [confirm])

    useEffect(() => {
        handlePredict()
    }, [image])

    useEffect(() => {
        const fetchAPI = async () => {
            
            const response: any = await axiosClient.get(`${appInfo.BASE_URL}/orderDetailsCollab?orderID=${orderID}`)
            setOrders(response.orders)
            console.log("'" + response.orders[0].imgConfirm + "'")
            if(response.orders[0].imgConfirm !== null && response.orders[0].imgConfirm !== ' '){
                setImage({
                    uri: response.orders[0].imgConfirm
                })
            }
            
        }

        const fetchAllData = async () => {
            setIsLoading(true)
            await fetchAPI();
            await loadModel();
            await loadLabels();
            setIsLoading(false)
        }

        fetchAllData()
        
    }, [])

    useEffect(()  => {
        
        const getPermission = async () => {
            await getCameraPermission(setHasCameraPermission);
            await getGallaryPermission(setHasGalleryPermission);
        }

        getPermission()
        
    }, [])
    return(
        <ContainerComponent back title="Chi tiết đơn hàng">
            <View style={styles.container}>
                {/* // seperate */}
                {/* <View style={{height: 2, width: '100%', backgroundColor: '#F7E2CD', marginTop: 10}}></View> */}
                {
                    
                    <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                        {
                            orders.map((order: any, index) => {
                                return (
                                    <View key={index}>
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false} 
                                            pagingEnabled={true}
                                            >
                                                { 
                                                    
                                                    order.image.map((img: any, index: number) => {
                                                        return (
                                                            <Image
                                                                key={index}
                                                                style={{marginTop: 20, width: windowWidth,
                                                                    height: windowHeight * 0.4, aspectRatio: 8/5}}
                                                                source={{
                                                                    uri: img.path
                                                                }}
                                                            />
                                                        )
                                                        
                                                    })
                                                }
                                            
                                        </ScrollView>
                                        
                                        <View style={{height: 2, width: '100%', backgroundColor: appColors.gray5, marginTop: 0}}></View>
                                        <View style={styles.content}>

                                            <View style={styles.infoUser}>
                                                <IconEvil name="location" size={25}/>
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Người cho</Text>
                                                    <Text>{order.order.giver.firstName} {order.order.giver.lastName} - {order.order.post.phonenumber}</Text>
                                                    <Text>{order.order.addressGive.address}</Text>
                                                    {/* <TextComponent text={order.order.addressGive.address}/> */}
                                                </View>
                                            </View>

                                            <View style={styles.infoUser}>
                                                <IconEvil name="location" color={'red'} size={25}/>
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Người lấy hàng</Text>
                                                    {
                                                        (status === 'Hàng đang được đến lấy' || status === 'Hàng đã nhập kho' )  &&(
                                                            <><Text>{order.order.receiver.firstName} {order.order.receiver.lastName} - {order.order.receiver.phoneNumber}</Text>
                                                            <Text>{order.order.addressReceive.address}</Text></>
                                                        )
                                                        
                                                    }
                                                    
                                                </View> 
                                            </View>
                                        </View>
                                        

                                        {/* // seperate */}
                                        <View style={{height: 2, width: '100%', backgroundColor: appColors.gray5, marginTop: 10}}></View>

                                        <View style={styles.content}>
                                            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Thông tin đơn hàng</Text>

                                            <View style={[styles.infoUser, {alignItems:'center'}]}>
                                                <Image
                                                    style={{width: 60, height: 60, marginRight: 10}}
                                                    source={
                                                        require('../../../assets/delivery-truck.png')
                                                    }
                                                />
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Lấy hàng trong ngày</Text>
                                                    <Text>Hết hạn vào ngày {moment(order.order.post.timeend).format("DD-MM-YYYY")}</Text>
                                                </View>
                                            </View>

                                            {/* <View style={[styles.infoUser, {alignItems:'center'}]}>
                                                <Image
                                                    style={{width: 60, height: 60, marginRight: 10}}
                                                    source={
                                                        require('../../../assets/delivery-bike.png')
                                                    }
                                                />
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Xe máy</Text>
                                                    <Text>Hàng hóa tối đa 30kg (50x40x50cm)</Text>
                                                </View>
                                            </View> */}

                                            <View style={[styles.infoUser, {alignItems:'center'}]}>
                                                <Image
                                                    style={{width: 60, height: 60, marginRight: 10}}
                                                    source={
                                                        require('../../../assets/item.png')
                                                    }
                                                />
                                                <View style={{flex: 1}}>
                                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>Hàng hóa</Text>
                                                    <Text>Số lượng {order.order.item.quantity} - {order.order.item.name}</Text>
                                                </View>
                                            </View>

                                            
                                        </View>
                                        
                                        <ShowMapComponent location = {{latitude: order.order.addressGive.latitude,
                                                                        longitude: order.order.addressGive.longitude,
                                                                        address: order.order.addressGive.address
                                        }} setLocation={''}/>

                                        <View style={{height: 2, width: '100%', backgroundColor: appColors.gray5, marginTop: 15}}></View>

                                        {
                                            (status === 'Hàng đang được đến lấy' || status === 'Chờ người cho giao hàng') &&
                                            <View style={styles.content}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Xác nhận đơn</Text>
                                                
                                                <TouchableOpacity style={[styles.infoUser, {alignItems:'center', justifyContent: 'space-evenly'}]}
                                                    onPress={() => TakePhoto(hasCameraPermission, setImage, null)}>
                                                    <Image
                                                        style={{width: 60, height: 60, marginRight: 10}}
                                                        source={{
                                                            uri: "https://cdn-icons-png.flaticon.com/128/3004/3004613.png"
                                                        }}
                                                    />
                                                    <View>
                                                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Thêm ảnh đã nhận hàng</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                

                                                {
                                                    image !== null && <Image
                                                        style={{marginTop: 20, width: '100%', aspectRatio: 8/5, borderRadius: 10}}
                                                        source={{
                                                            uri: image.uri
                                                        }}
                                                    />
                                                }
                                                
                                                
                                                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 50, backgroundColor: appColors.primary2,
                                                        paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30,
                                                        display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                                        alignItems: 'center'}}
                                                        onPress={() => handleConfirm()}>
                                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                                                        Xác nhận nhận hàng
                                                    </Text>
                                                </TouchableOpacity>
                                                
                                                
                                            </View> 
                                        }

                                        {
                                            status === 'Chờ cộng tác viên lấy hàng' &&
                                            <View style={styles.content}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Giao đơn hàng</Text>
                                            
                                                <TouchableOpacity style={{marginVertical: 10, marginHorizontal: 50, backgroundColor: appColors.primary2,
                                                        paddingVertical: 15, paddingHorizontal: 20, borderRadius: 30,
                                                        display: 'flex', flexDirection: 'row', justifyContent: 'center',
                                                        alignItems: 'center'}}
                                                        onPress={() => receiveOrder()}>
                                                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                                                        Nhận đơn hàng này
                                                    </Text>
                                                </TouchableOpacity>
                                                
                                                
                                            </View>
                                        }

                                        {           
                                            status === 'Hàng đã nhập kho' &&
                                            <View style={styles.content}>
                                                <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 20}}>Xác nhận đơn</Text>
                                                
                                                {
                                                    image !== null && <Image
                                                        style={{marginTop: 20, width: '100%', aspectRatio: 8/5, borderRadius: 10}}
                                                        source={{
                                                            uri: image.uri
                                                        }}
                                                    />
                                                }
                                            </View> 
                                        }
                                        
                                    </View>
                                )
                            })
                        }
                        

                        
                        
                        
                    </ScrollView>
                }
                
                
            </View>
            
            <ConfirmComponent visible={isVisibleModalConfirm} setVisible={setIsVisibleModalConfirm} title={'Bạn có thực sự muốn nhận đơn hàng này?'} setConfirm={setConfirm} setIsLoading={setIsLoading}/>
            <LoadingModal visible={isLoading}/>
            <ConfirmCategoryReceiveModal setVisible={setVisibleConfirmCategory} visible={visibleConfirmCategory} setImage={setImage} setVisibleConfirmReceiveModal={setVisibleRating} categoryGive={orders[0]?.order.item.nametype} currentCategory={currentCategory} />
            <RatingModal visible={visibleRating} setVisible={setVisibleRating} usergiveid={orders[0]?.order.giver.userID} orderid={orders[0]?.order.orderID}/>
        </ContainerComponent>
        
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 10,
        padding: 10
    },
    infoUser: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        columnGap: 10,
    }
})