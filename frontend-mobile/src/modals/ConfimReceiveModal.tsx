import { StyleSheet, Text, View, Modal, Pressable, Image, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
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

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native/dist/platform_react_native';
import { decode as jpegDecode } from 'jpeg-js';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem  from 'expo-file-system';


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

  const modelURL = 'https://teachablemachine.withgoogle.com/models/5tKZ1qkgC/';
  const [labels, setLabels] = useState<string[]>([]);


  const [model, setModel] = useState<any>(null);


  const loadLabels = () => {
    const metadata = require('../../assets/model/metadata.json');
    if (metadata && metadata.labels) {
      setLabels(metadata.labels);
    }
  };

  const loadModel = async () => {
    try {
      setIsLoading(true);
      await tf.ready();  
      setModel(await tf.loadLayersModel(modelURL + 'model.json'));
      console.log('model Loaded !!!!!');
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading the model', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadModel();
    loadLabels();
  },[])



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
  

  const handleConfirm = async () => {
    setIsLoading(true);
    // const {width,height} = image;

    // let isHeightSmaller = width > height ? true : false;

    // let scaleX = width / 224;
    // let scaleY = height/ 224;
    // let h = 224;
    // let w = 224;
    // if(isHeightSmaller){
    //   w = scaleX * 224 / scaleY;
    // }
    // else{
    //   h = scaleY * 224 / scaleX;
    // }

    // Resize ảnh
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 224, height: 224 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    const prediction: any = await predictImage({ uri: manipulatedImage.uri }); // Dự đoán ảnh đã resize

    const [nameType, category] = prediction ? prediction?.label.split('-') : '';

    if(category === 'Nhạy cảm' && prediction?.probability > 0.8){
      Alert.alert('Bạn không thể sử dụng ảnh này vì lý do: ', ' Ảnh được nhận diện là ảnh nhạy cảm');
      setModalConfirmVisible(false);
      return;
    }

    else {
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
