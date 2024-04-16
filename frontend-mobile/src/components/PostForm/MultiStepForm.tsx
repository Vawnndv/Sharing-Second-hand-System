import React, { useEffect, useState } from 'react';
import StepOne from './PostItemFormStepOne';
import StepTwo from './PostItemFormStepTwo';
import { Button } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import itemsAPI from '../../apis/itemApi'
import postAPI from '../../apis/postApi';
import { appInfo } from '../../constants/appInfos';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import { UploadImageToAws3 } from '../../ImgPickerAndUpload';
import ContainerComponent from '../ContainerComponent';
import ItemTabComponent from '../../screens/home/components/ItemTabComponent';
import { useNavigation } from '@react-navigation/native';




interface FormDataStepOne {
  itemName: string;
  itemPhotos: string[]; // Sử dụng dấu '?' để biểu thị rằng thuộc tính này không bắt buộc
  itemCategory: string;
  itemQuantity: string;
  itemDescription: string;
  methodGive: string;
  methodsBringItemToWarehouse?: string;
  warehouseAddress?: string;
  warehouseAddressID?: number;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}


interface FormDataStepTwo {
  postTitle: string;
  postDescription: string;
  postStartDate: string;
  postEndDate: string;
  postPhoneNumber: string
  postAddress: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

const MultiStepForm = () => {

  const navigation: any = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataStepOne, setFormDataStepOne] = useState<FormDataStepOne>({ itemName: '', itemPhotos: [], itemCategory: 'Chọn loại món đồ', itemQuantity: '', itemDescription: '', methodGive: 'Chọn phương thức cho', methodsBringItemToWarehouse: 'Chọn phương thức mang đồ đến kho', warehouseAddress: 'Chọn kho' });
  const [formDataStepTwo, setFormDataStepTwo] = useState<FormDataStepTwo>({ postTitle: '', postDescription: '', postStartDate: '', postEndDate: '', postPhoneNumber: '', postAddress: ''  /* khởi tạo các trường khác */ });

  const [isCompleted, setIsCompleted] = useState(false);

  const auth = useSelector(authSelector);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne setStep={setCurrentStep} formData={formDataStepOne} setFormData={setFormDataStepOne} />;
      case 2:
        return <StepTwo setStep={setCurrentStep} formData={formDataStepTwo} setFormData={setFormDataStepTwo} />;
      // Có thể thêm các case khác cho các bước tiếp theo
      default:
        return null;
    }
  };



  const handleSubmit = async () => {
    // Kiểm tra các trường bắt buộc
    if (!formDataStepTwo.postTitle.trim()) {
      alert('Tiêu đề bài đăng là bắt buộc.');
      return;
    }
    if (!formDataStepTwo.postDescription.trim()) {
      alert('Nội dung của bài đăng là bắt buộc.');
      return;
    }
    if (!formDataStepTwo.postStartDate.trim()) {
      alert('Ngày bắt đầu là bắt buộc.');
      return;
    }

    if (!formDataStepTwo.postEndDate.trim()) {
      alert('Ngày kết thúc là bắt buộc.');
      return;
    }
    
    if (!formDataStepTwo.postPhoneNumber.trim()) {
      alert('Số điện thoại là bắt buộc.');
      return;
    }

    if (!formDataStepTwo.postAddress.trim()) {
      alert('Địa chỉ là bắt buộc.');
      return;
    }
    let itemID = 0;
    let postID = 0;
    let address = '';
    let addressid = 0;
    let orderID = 0;

    try {
      const name = formDataStepOne.itemName;
      const quantity = parseInt(formDataStepOne.itemQuantity);
      const itemtypeID = parseInt(formDataStepOne.itemCategory)
      const res = await axios.post(`${appInfo.BASE_URL}/items`, {
        name,
        quantity,
        itemtypeID,
      });
      itemID = res.data.item.itemid;
      console.log(res.data.item.itemid);
      // Alert.alert('Success', 'Item created successfully');
      } catch (error) {
        console.log(error);
      }

    try {
      const title = formDataStepTwo.postTitle;
      const location = formDataStepTwo.postAddress;
      const description = formDataStepTwo.postDescription;
      const owner = auth.id; // Thay đổi giá trị này tùy theo logic ứng dụng của bạn
      const time = new Date();
      const itemid = itemID;
      const timestart = new Date(formDataStepTwo.postStartDate);
      const timeend = new Date(formDataStepTwo.postEndDate);
      
      // console.log({title, location, description, owner, time, itemid, timestart, timeend})
      const response = await axios.post(`${appInfo.BASE_URL}/posts/createPost`, {
        title,
        location,
        description,
        owner,
        time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
        itemid,
        timestart: new Date(timestart).toISOString(), // Tương tự cho timestart
        timeend: new Date(timeend).toISOString(), // Và timeend
      });       
      console.log(response.data.postCreated);
      postID = response.data.postCreated.postid;
      address = response.data.postCreated.address;
      addressid = response.data.postCreated.addressid;
    } catch (error) {
      console.error('Error creating item and post:', error);
      Alert.alert('Error', 'Failed to create item and post. Please try again later.');
    }

    try {
      const title = formDataStepTwo.postTitle;
      const location = ' ';
      const description = ' ';
      const departure = address;
      const time = new Date();
      const itemid = itemID;
      const status = 'Chờ xét duyệt';
      const qrcode = ' ';
      const ordercode = ' ';
      const usergiveid = auth.id;
      const postid = postID;
      const imgconfirm = ' ';
      const locationgive = addressid;
      let locationreceive = null;
      let givetypeid = 1;
      const imgconfirmreceive = ' ';
      let givetype = 'Cho nhận trực tiếp';
      // let givetype = 'Cho nhận trực tiếp';
      // if(formDataStepOne.methodsBringItemToWarehouse )
      if( formDataStepOne.methodGive == "Gửi món đồ đến kho"){
        givetype = 'Cho kho';
        givetypeid = 3;
        if(formDataStepOne.methodsBringItemToWarehouse == "Chúng tôi sẽ đến lấy"){
          locationreceive = formDataStepOne.warehouseAddressID;
          givetype = 'Cho kho (kho đến lấy)';
          givetypeid = 4;
        }
      }

      // console.log({title, location, description, owner, time, itemid, timestart, timeend})
      const response = await axios.post(`${appInfo.BASE_URL}/order/createOrder`, {
        title,
        location,
        description,
        departure,
        time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
        itemid,
        status,
        qrcode,
        ordercode,
        usergiveid,
        postid,
        imgconfirm,
        locationgive,
        locationreceive,
        givetypeid,
        imgconfirmreceive,
        givetype

      });       
      console.log(response.data.orderCreated);
      orderID = response.data.orderCreated.orderid;
      // Alert.alert('Success', 'Item, Post, Order created successfully');
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create Item, Post, Order. Please try again later.');
      setIsCompleted(false);
    }

    try {
      const currentstatus = 'Chờ xét duyệt';
      const orderid = orderID;
      // console.log({title, location, description, owner, time, itemid, timestart, timeend})
      const response = await axios.post(`${appInfo.BASE_URL}/order/createTrace`, {
        currentstatus,
        orderid,
      });
      console.log(response.data.traceCreated)
      Alert.alert('Success', 'Item, Post, Order, Trace created successfully');
      setCurrentStep(1);
      setFormDataStepOne({ ...formDataStepOne,  itemName: '', itemPhotos: [], itemCategory: 'Chọn loại món đồ', itemQuantity: '', itemDescription: '', methodGive: 'Chọn phương thức cho', methodsBringItemToWarehouse: 'Chọn phương thức mang đồ đến kho', warehouseAddress: 'Chọn kho'  })
      setFormDataStepTwo({ ...formDataStepTwo,  postTitle: '', postDescription: '', postStartDate: '', postEndDate: '', postPhoneNumber: '', postAddress: '' })
      setIsCompleted(false);
      navigation.navigate('Home', {screen: 'HomeScreen'})
      // navigation.goBack();
    } catch (error) {
      console.error('Error creating Trace:', error);
      Alert.alert('Error', 'Failed to create Item, Post, Order, Trace. Please try again later.');
      setIsCompleted(false);
    }

    try{
      formDataStepOne.itemPhotos.map(async (image) => {
        const data = await UploadImageToAws3(image);
        
        const responseUploadImage = await axios.post(`${appInfo.BASE_URL}/items/upload-image`,{
          path: data.url,
          itemID: itemID
        })

        console.log(responseUploadImage)
      })
      
    } catch (error) {
      console.log(error)
    }


  };


  // if (isCompleted) {
  //   return (
  //     <ContainerComponent right>
  //       {/* <StatisticScreen/> */}
  //       <ItemTabComponent />
  //     </ContainerComponent>
  //   )
  // }

  return (
    <ScrollView>
      <View style={styles.screenContainer}>
        <ScrollView  style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>CHIA SẺ KHO BÁU CỦA BẠN</Text>
            {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}>
              <MaterialCommunityIcons name="keyboard-backspace" size={30} color="black" />
            </TouchableOpacity>
          )}
        </View>
          {renderStep()}
          {currentStep === 2 && (
            <Button style= {styles.button} mode="contained" onPress={handleSubmit}>Gửi</Button> // Sửa lại để thực hiện submit thực tế
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  screenContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    paddingHorizontal: 10,
  },

  container: {
    width: '95%'
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center', // Thêm vào để căn giữa tiêu đề theo chiều ngang
    alignSelf: 'center', // Đảm bảo Text căn giữa trong View cha nếu cần
    width: '100%', // Đảm bảo Text có chiều rộng đủ để căn giữa đúng cách
    padding: 20,
    paddingTop: 50,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 30,

  },
});


export default MultiStepForm;