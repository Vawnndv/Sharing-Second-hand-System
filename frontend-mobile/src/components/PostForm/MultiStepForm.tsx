import React, { useEffect, useState } from 'react';
import StepOne from './PostItemFormStepOne';
import StepTwo from './PostItemFormStepTwo';
import { Button } from 'react-native-paper';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import itemsAPI from '../../apis/itemApi';
import postAPI from '../../apis/postApi';
import { appInfo } from '../../constants/appInfos';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import { UploadImageToAws3 } from '../../ImgPickerAndUpload';
import ContainerComponent from '../ContainerComponent';
import ItemTabComponent from '../../screens/home/components/ItemTabComponent';
import { useNavigation } from '@react-navigation/native';
import { ProfileModel } from '../../models/ProfileModel';
import { LoadingModal } from '../../modals';
import axiosClient from '../../apis/axiosClient';
import { appColors } from '../../constants/appColors';
import ButtonComponent from '../ButtonComponent';


interface FormDataStepOne {
  itemName: string;
  itemPhotos: any[]; // Sử dụng dấu '?' để biểu thị rằng thuộc tính này không bắt buộc
  itemCategory: string;
  itemQuantity: string;
  itemDescription: string;
  methodGive: string;
  methodsBringItemToWarehouse?: string;
  warehouseAddress?: string;
  warehouseAddressID?: number;
  warehouseID?: number;
  itemCategoryLabel: string;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}


interface FormDataStepTwo {
  postTitle: string;
  postDescription: string;
  postStartDate: string;
  postEndDate: string;
  postPhoneNumber: string;
  postAddress: string;
  postGiveMethod?: string;
  postBringItemToWarehouse?: string;
  location?: any
  itemPhotos?: any[]; // Sử dụng dấu '?' để biểu thị rằng thuộc tính này không bắt buộc


  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

interface FormData {
  itemName: string;
  itemPhotos: any[]; // Sử dụng dấu '?' để biểu thị rằng thuộc tính này không bắt buộc
  itemCategory: string;
  itemQuantity: string;
  itemDescription: string;
  methodGive: string;
  methodsBringItemToWarehouse?: string;
  warehouseAddress?: string;
  warehouseAddressID?: number;
  warehouseID?: number;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

 export interface ErrorProps  {
  postTitle: string;
  postDescription: string;
  postStartDate: string;
  postEndDate: string;
  postPhoneNumber: string;
  postAddress: string;
  postGiveMethod?: string;
}

const MultiStepForm = () => {

  const navigation: any = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formDataStepOne, setFormDataStepOne] = useState<FormDataStepOne>({ itemName: '', itemPhotos: [], itemCategory: 'Chọn loại món đồ', itemCategoryLabel: 'Chọn loại món đồ', itemQuantity: '', itemDescription: '', methodGive: 'Chọn phương thức cho', methodsBringItemToWarehouse: 'Chọn phương thức mang đồ đến kho', warehouseAddress: 'Chọn kho' });
  const [formDataStepTwo, setFormDataStepTwo] = useState<FormDataStepTwo>({ postTitle: '', postDescription: '', postStartDate: '', postEndDate: '', postAddress: '', postPhoneNumber: '' /* khởi tạo các trường khác */ });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isValidSubmit, setIsValidSubmit] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [location, setLocation] = useState<any>(false);
  
  const [warehouseSelected, setWarehouseSelected] = useState<any>(null);

  const [countClickGenerate, setCountClickGenerate] = useState(0);

  const [errorMessage, setErrorMessage] = useState<ErrorProps>({
    postTitle: '',
    postDescription: '',
    postStartDate: '',
    postEndDate: '',
    postPhoneNumber: '',
    postAddress: '',
    postGiveMethod: '',
  });

  const auth = useSelector(authSelector);


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne setStep={setCurrentStep} formData={formDataStepOne} setFormData={setFormDataStepOne} warehouseSelected={warehouseSelected} setWarehouseSelected={setWarehouseSelected}/>;
      case 2:
        return <StepTwo setStep={setCurrentStep} formData={formDataStepTwo} setFormData={setFormDataStepTwo} errorMessage={errorMessage} setErrorMessage={setErrorMessage} location={location} setLocation={setLocation} itemPhotos={formDataStepOne.itemPhotos} itemCategory={formDataStepOne.itemCategory} countClickGenerate={countClickGenerate} setCountClickGenerate={setCountClickGenerate}/>;
      // Có thể thêm các case khác cho các bước tiếp theo
      default:
        return null;
    }
  };

  useEffect(() => {
    const updates: Partial<FormDataStepTwo> = {};
  
    if (formDataStepOne.methodGive && formDataStepOne.methodGive != 'Chọn phương thức cho') {
      updates.postGiveMethod = formDataStepOne.methodGive;
    }


    if (formDataStepOne.methodsBringItemToWarehouse && formDataStepOne.methodsBringItemToWarehouse != 'Chọn phương thức mang đồ đến kho' &&  formDataStepOne.methodGive != 'Đăng món đồ lên hệ thống') {

      updates.postBringItemToWarehouse = formDataStepOne.methodsBringItemToWarehouse;
    }

    
    if (formDataStepOne.methodGive == 'Đăng món đồ lên hệ thống') {

      updates.postBringItemToWarehouse = '';
    }
  
    if (Object.keys(updates).length > 0) {
      setFormDataStepTwo(prevData => ({ ...prevData, ...updates }));
    }
  }, [formDataStepOne.methodGive, formDataStepOne.methodsBringItemToWarehouse]);



  useEffect(() => {
    if (
      !errorMessage.postTitle && 
      !errorMessage.postDescription && 
      !errorMessage.postStartDate && 
      !errorMessage.postEndDate && 
      !errorMessage.postPhoneNumber && 
      !errorMessage.postAddress && 
      formDataStepTwo.postTitle && 
      formDataStepTwo.postDescription && 
      formDataStepTwo.postStartDate && 
      formDataStepTwo.postEndDate && 
      formDataStepTwo.postPhoneNumber      
    ){
      if(formDataStepOne.methodGive == 'Gửi món đồ đến kho' && formDataStepOne.methodsBringItemToWarehouse == 'Tự đem đến kho'){
        setIsValidSubmit(true);
      }
      else{
        if(formDataStepTwo.postAddress){
          setIsValidSubmit(true);
        }
        else{
          setIsValidSubmit(false);
        }
      }
    }
    else{
      setIsValidSubmit(false);
    }
  })



  const handleSubmit = async () => {
    if (
      !errorMessage.postTitle && 
      !errorMessage.postDescription && 
      !errorMessage.postStartDate && 
      !errorMessage.postEndDate && 
      !errorMessage.postPhoneNumber && 
      !errorMessage.postAddress && 
      formDataStepTwo.postTitle && 
      formDataStepTwo.postDescription && 
      formDataStepTwo.postStartDate && 
      formDataStepTwo.postEndDate && 
      formDataStepTwo.postPhoneNumber && 
      formDataStepTwo.postAddress 
    ) {

      let itemID = 0;
      let postID = 0;
      let address = '';
      let addressid = 0;
      let orderID = 0;
      let statusid = 2;

      let givetypeid = 1;
      let warehouseid = null;
      // let givetype = 'Cho nhận trực tiếp';
      // if(formDataStepOne.methodsBringItemToWarehouse )
      setIsLoading(true);
      if( formDataStepOne.methodGive == "Gửi món đồ đến kho"){
        givetypeid = 3;
        if(formDataStepOne.methodsBringItemToWarehouse == "Nhân viên kho sẽ đến lấy"){
          // locationreceive = formDataStepOne.warehouseAddressID;
          givetypeid = 4;
        }
        else{
          warehouseid = warehouseSelected.warehouseid;
        }
      }
  
      try {
        const name = formDataStepOne.itemName;
        const quantity = parseInt(formDataStepOne.itemQuantity);
        const itemtypeID = parseInt(formDataStepOne.itemCategory);
        const res: any = await axiosClient.post(`${appInfo.BASE_URL}/items`, {
          name,
          quantity,
          itemtypeID,
        });

        itemID = res.item.itemid;
        // Alert.alert('Success', 'Item created successfully');
        } catch (error) {
          console.log(error);
        }
  
      try {
        const title = formDataStepTwo.postTitle;
        const locationTemp = formDataStepTwo.postAddress;
        const description = formDataStepTwo.postDescription;
        const owner = auth.id; // Thay đổi giá trị này tùy theo logic ứng dụng của bạn
        const time = new Date();
        const itemid = itemID;
        const timestart = new Date(formDataStepTwo.postStartDate);
        const timeend = new Date(formDataStepTwo.postEndDate);
        
        let response : any = null;

        if(formDataStepOne.methodGive === "Đăng món đồ lên hệ thống"){

          response = await axiosClient.post(`${appInfo.BASE_URL}/posts/createPost`, {
            title,
            location: locationTemp,
            description,
            owner,
            time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
            itemid,
            timestart: new Date(timestart).toISOString(), // Tương tự cho timestart
            timeend: new Date(timeend).toISOString(), // Và timeend
            isNewAddress: location.addressid ? false : true,
            postLocation: location,
            isWarehousePost: false,
            statusid: statusid,
            givetypeid: givetypeid,
            phonenumber: formDataStepTwo.postPhoneNumber
          });
          
        }
        else if(formDataStepOne.methodsBringItemToWarehouse === "Tự đem đến kho"){
          response = await axiosClient.post(`${appInfo.BASE_URL}/posts/createPost`, {
            title,
            location: locationTemp,
            description,
            owner,
            time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
            itemid,
            timestart: new Date(timestart).toISOString(), // Tương tự cho timestart
            timeend: new Date(timeend).toISOString(), // Và timeend
            isNewAddress: false,
            postLocation: warehouseSelected,
            isWarehousePost: false,
            statusid: statusid,
            givetypeid: givetypeid,
            warehouseid: warehouseid,
            phonenumber: formDataStepTwo.postPhoneNumber
          });
        }
        else if(formDataStepOne.methodsBringItemToWarehouse === "Nhân viên kho sẽ đến lấy"){
            response = await axiosClient.post(`${appInfo.BASE_URL}/posts/createPost`, {
            title,
            location: locationTemp,
            description,
            owner,
            time: new Date(time).toISOString(), // Đảm bảo rằng thời gian được gửi ở định dạng ISO nếu cần
            itemid,
            timestart: new Date(timestart).toISOString(), // Tương tự cho timestart
            timeend: new Date(timeend).toISOString(), // Và timeend
            isNewAddress: location.addressid ? false : true,
            postLocation: location,
            isWarehousePost: false,
            statusid: statusid,
            givetypeid: givetypeid,
            phonenumber: formDataStepTwo.postPhoneNumber

          });
        }     

        postID = response.postCreated.postid;
        // address = response.data.postCreated.address;
        // addressid = response.data.postCreated.addressid;


      } catch (error) {
        console.log(error);
        Alert.alert('Lỗi', 'Lỗi khi tạo bài viết và sản phẩm. Vui lòng thử lại.');
      } finally{
        setCurrentStep(1);
        setFormDataStepOne({ ...formDataStepOne,  itemName: '', itemPhotos: [], itemCategory: 'Chọn loại món đồ', itemQuantity: '', itemDescription: '', methodGive: 'Chọn phương thức cho', methodsBringItemToWarehouse: 'Chọn phương thức mang đồ đến kho', warehouseAddress: 'Chọn kho'  })
        setFormDataStepTwo({ ...formDataStepTwo,  postTitle: '', postDescription: '', postStartDate: '', postEndDate: '', postPhoneNumber: '', postAddress: '' });
        setIsLoading(false);
        navigation.navigate('ThankYouScreen', {
          title: 'Gửi bài viết thành công!!',
          postID: postID,
          content: 'Cảm ơn bạn rất nhiều vì đã cho món đồ, bài viết của bạn sẽ sớm được đội ngũ cộng tác viên kiểm duyệt',
        })

      }
  
      try{
        formDataStepOne.itemPhotos.map(async (image) => {
          const data = await UploadImageToAws3(image, false);
          const responseUploadImage = await axiosClient.post(`${appInfo.BASE_URL}/items/upload-image`,{
            path: data.url,
            itemID: itemID
          })

        })
        
      } catch (error) {
        console.log(error)
      }

      try{
        const response = await axiosClient.post(`${appInfo.BASE_URL}/statistic/insertAnalytic`,{
          type: 'post'
        })
      }catch(error){
        console.log(error)
      }

      setIsLoading(false)
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

      <LoadingModal visible={isLoading} />

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
            // <Button style={[styles.button, { backgroundColor: isValidSubmit ? appColors.primary2 : appColors.gray3 } ]} mode="contained" disabled={!isValidSubmit} onPress={handleSubmit}>Gửi</Button> // Sửa lại để thực hiện submit thực tế
            <ButtonComponent
            disable={!isValidSubmit}
            onPress={handleSubmit}
            text={"Gửi"}
            type='primary'
            iconFlex="right"
            styles={{ padding: 20 , margin: 10, marginBottom: 30}}
          
          />       
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
    // padding: 20,

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
    backgroundColor: appColors.primary2
  },
});


export default MultiStepForm;