import React, { useEffect, useRef, useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, StyleSheet, Text, TouchableOpacity, Platform, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ProfileModel } from '../../models/ProfileModel';
import { authSelector } from '../../redux/reducers/authReducers';
import { appInfo } from '../../constants/appInfos';
import { ErrorProps } from './MultiStepForm';
import { appColors } from '../../constants/appColors';
import TextComponent from '../TextComponent';
import ShowMapComponent from '../ShowMapComponent';
import getGPTDescription from '../../apis/apiChatGPT';
import LoadingComponent from '../LoadingComponent';
import { LoadingModal } from '../../modals';
import { UploadImageToAws3 } from '../../ImgPickerAndUpload';
import axiosClient from '../../apis/axiosClient';
import { category } from '../../constants/appCategories';

interface FormData {
  postTitle: string;
  postDescription: string;
  postStartDate: string;
  postEndDate: string;
  postPhoneNumber: string
  postAddress: string;
  postGiveMethod?: string;
  postBringItemToWarehouse?: string;
  location?: any;
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

interface StepTwoProps {
  setStep: (step: number) => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  errorMessage: ErrorProps;
  setErrorMessage: (errorMessage: ErrorProps) => void;
  location: any;
  setLocation: any;
  itemPhotos: any[],
  itemCategory: string,
  countClickGenerate: number,
  setCountClickGenerate: any
}


const StepTwo: React.FC<StepTwoProps> = ({ setStep, formData, setFormData, errorMessage, setErrorMessage, location, setLocation, itemPhotos, itemCategory, countClickGenerate, setCountClickGenerate }) => {

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [minEndDate, setMinEndDate] = useState<Date>(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [profile, setProfile] = useState<ProfileModel>();
  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingGenerateGPT, setIsLoadingGenerateGPT] = useState(false)

  const [newItemPhotos, setNewItemPhotos] = useState<any>(null)

  const auth = useSelector(authSelector);

  const textInputRef = useRef<any>(null);

  useEffect( () => {
    const fetchUserData = async () =>{
        try {
          const res = await axiosClient.get(`${appInfo.BASE_URL}/user/get-profile/?userId=${auth.id}`)
          // const res = await postsAPI.HandlePost(
          //   `/${postID}`,
          // );
          if (!res) {
            throw new Error('Failed to fetch user info'); // Xử lý lỗi nếu request không thành công
          }

          setProfile(res.data);
          setFormData({
            ...formData,
            postAddress: res.data.address,
            postPhoneNumber: res.data.phonenumber,
          });
          } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
        }
    }

    const fetchUserAddressData = async () =>{
      try {
        const response = await axiosClient.get(`${appInfo.BASE_URL}/user/get-user-address?userId=${auth.id}`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!response) {
          throw new Error('Failed to fetch user info'); // Xử lý lỗi nếu request không thành công
        }

        setLocation({
          addressid: response.data.addressid,
          address: response.data.address,
          latitude: parseFloat(response.data.latitude),
          longitude: parseFloat(response.data.longitude)
        });
        
        } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
      }
    }

    const fetchImages = async () => {
      try {
        let addPhotosURL = []
        for(let i = 0; i < itemPhotos.length; i++){
          const response: any = await UploadImageToAws3(itemPhotos[i], true)
          addPhotosURL.push({
            uri: itemPhotos[i].uri,
            name: itemPhotos[i].name,
            type: itemPhotos[i].mimeType,
            url: response.url
          })
        }
        setNewItemPhotos(addPhotosURL)
      } catch (error) {
        console.log("FetchImages: ",error)
      }
      
    }
   
    const fetchAllData = async () => {
      setIsLoading(true)

      await fetchUserData();
      await fetchUserAddressData()
      await fetchImages()
      
      setIsLoading(false)
    }
    fetchAllData()
    
  },[] )

  
  useEffect(() => {
    if (startDate) {
      setMinEndDate(startDate);
    }
  }, [startDate]);

  useEffect(() => {
    
    if (formData.postStartDate){
      setStartDate(new Date(Date.parse(formData.postStartDate)));
    }

    if(formData.postEndDate){
      setEndDate(new Date(Date.parse(formData.postEndDate)));
    }
  },[formData.postStartDate, formData.postEndDate])

  useEffect(() =>{
    if(location){
      setFormData({ ...formData, postAddress: location.address ? location.address : ''});
    }
  },[location])

  useEffect(() =>{
    if(profile){
      setFormData({ ...formData, postPhoneNumber: profile.phonenumber ? profile.phonenumber : ''});
    }
  },[profile])

  const handleBlur = () => {
    // Khi mất focus, reset giá trị của TextInput
    if (textInputRef.current) {
      textInputRef.current.setNativeProps({ selection: { start: 0, end: 0 } });
    }
  };



  const onChangeStartDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate ? selectedDate : startDate;
    setStartDatePickerVisibility(Platform.OS === 'ios');
    setStartDate(currentDate);
    setEndDate(null);
    setFormData({ ...formData,  postStartDate: moment(currentDate).format('YYYY-MM-DD') });
    setErrorMessage({...errorMessage, postStartDate: ''});
    setErrorMessage({...errorMessage, postEndDate: ''});

  };


  
  const onChangeEndDate = (event: any, selectedDate: Date | undefined) => {

    if (!startDate) {
      setErrorMessage({...errorMessage, postEndDate: 'Vui lòng chọn ngày bắt đầu trước.'})
      setStartDatePickerVisibility(false);
      setEndDatePickerVisibility(false);
      return;
    }

    if (startDate != null) {
      const currentDate = selectedDate ? selectedDate : endDate;
      setEndDatePickerVisibility(Platform.OS === 'ios');
      setEndDate(currentDate);
      setFormData({ ...formData,  postEndDate: moment(currentDate).format('YYYY-MM-DD') }); // Cập nhật formData
      setErrorMessage({...errorMessage, postEndDate: ''});
    }
  };
  

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    if (!startDate) {
      setStartDatePickerVisibility(false);
      setEndDatePickerVisibility(false);
      setErrorMessage({...errorMessage, postEndDate: 'Vui lòng chọn ngày bắt đầu trước'});

      return;
    }
    else{
      setEndDatePickerVisibility(true);
    }   
  };


  const handleValidate = (text: any, typeCheck: string) =>  {
    let updatedErrorMessage = {...errorMessage};
    // Kiểm tra các trường bắt buộc
    if(typeCheck == 'postitle'){
      if (!text.trim()) {
        updatedErrorMessage.postTitle = 'Vui lòng nhập tiêu đề bài đăng.';
        setFormData({ ...formData, postTitle: '' });

      } else{
        updatedErrorMessage.postTitle = '';
        setFormData({ ...formData, postTitle: text });
      }
    }

    else if(typeCheck == 'postdescription'){
      if (!text.trim()) {
        updatedErrorMessage.postDescription = 'Vui lòng nhập nội dung bài đăng.';
        setFormData({ ...formData, postDescription: '' });

      } else {
        updatedErrorMessage.postDescription = '';
        setFormData({ ...formData, postDescription: text });

      }
    }

    else if(typeCheck == 'postphonenumber'){
      if (!text) {
        updatedErrorMessage.postPhoneNumber = 'Vui lòng nhập số điện thoại.';
        setFormData({ ...formData, postPhoneNumber: '' });
      }
      else if (text.trim().length < 10 || text.trim().length > 11) {
        updatedErrorMessage.postPhoneNumber = 'Số điện thoại này không hợp lệ.';
        setFormData({ ...formData, postPhoneNumber: text });
      }
      else {
        updatedErrorMessage.postPhoneNumber = '';
        setFormData({ ...formData, postPhoneNumber: text });
      }
    }

    // if(typeCheck == 'postaddress'){
    //   if (!formData.postAddress) {
    //     updatedErrorMessage.postAddress = 'Vui lòng nhập địa chỉ.';
    //     setFormData({ ...formData, postAddress: '' });

    //   } else {
    //     updatedErrorMessage.postAddress = '';
    //   }
    // }

    // if(typeCheck == 'postenddate'){
    //   if (!startDate){
    //     updatedErrorMessage.postEndDate = 'Vui lòng chọn ngày bắt đầu trước.';
    //   }
    //   else if (!text && startDate) {
    //     updatedErrorMessage.postEndDate = 'Vui lòng chọn ngày kết thức.';
    //   } else {
    //     updatedErrorMessage.postEndDate = '';
    //   }
    // }
    setErrorMessage(updatedErrorMessage);

  }

  const generateDecription = async () => {
    setIsLoadingGenerateGPT(true)
    if(countClickGenerate < 3){
      try {
        const imageUrls: string[] = newItemPhotos.map((img: any) => {
          return img.url
        })
        const categoryName = category[parseInt(itemCategory) - 1]
        console.log(imageUrls, categoryName)
        const response = await getGPTDescription(categoryName, imageUrls)
        setFormData({ ...formData, postDescription: response });
        handleValidate(response,'postdescription')
        setCountClickGenerate(countClickGenerate + 1);
      } catch (error) {
        Alert.alert("Thông báo", "Tạo mô tả tự động đã gặp vấn đề, xin vui lòng thử lại!")
        console.log(error)
        setIsLoadingGenerateGPT(false)
      }
    }else{
      Alert.alert("Thông báo", "Bạn đã đạt giới hạn tối đa tạo mô tả tự động cho bài đăng này!")
    }
    
    setIsLoadingGenerateGPT(false)
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <ScrollView style = {styles.container}>
      <LoadingModal visible={isLoadingGenerateGPT} />
      <Text style={styles.title}>Thông tin bài đăng sản phẩm </Text>
      <TextInput
        label="Tiêu đề bài đăng"
        value={formData.postTitle}
        onBlur={() => handleValidate(formData.postTitle,'postitle')}
        onChangeText={(text) => {
          setFormData({ ...formData, postTitle: text });
          // setErrorMessage({...errorMessage, postTitle: ''});
          handleValidate(text,'postitle');
        }}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        error={errorMessage.postTitle? true : false}
        theme={{
          colors: {
            error: appColors.danger, 
          },
        }}
      />
      {(errorMessage.postTitle) && <TextComponent text={errorMessage.postTitle}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
      
        <TextInput
          label="Nội dung của bài đăng"
          value={formData.postDescription}
          onBlur={() => handleValidate(formData.postDescription,'postdescription')}
          onChangeText={(text) => {
            setFormData({ ...formData, postDescription: text });
            // setErrorMessage({...errorMessage, postDescription: ''});
            handleValidate(text,'postdescription');

          }}
          style={styles.inputDescription}
          underlineColor="gray" // Màu của gạch chân khi không focus
          activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
          multiline={true} // Cho phép nhập nhiều dòng văn bản
          numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
          error={errorMessage.postDescription? true : false}
          theme={{
            colors: {
              error: appColors.danger, 
            },
          }}
        />
        <Button icon="autorenew" mode="contained" onPress={generateDecription} style={styles.button}>
            Tạo mô tả tự động
        </Button>

        {(errorMessage.postDescription) && <TextComponent text={errorMessage.postDescription}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
      <TouchableOpacity onPress={showStartDatePicker}>
        <TextInput
          label="Ngày bắt đầu"
          value={startDate ? moment(startDate).format('YYYY-MM-DD') : ''} // Hiển thị ngày được chọn dưới dạng YYYY-MM-DD
          style={styles.input}
          editable={false} // Người dùng không thể chỉnh sửa trực tiếp
          error={errorMessage.postStartDate? true : false}
          theme={{
            colors: {
              error: appColors.danger, 
            },
          }}
        />

      </TouchableOpacity>
        {isStartDatePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate ? startDate : new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            minimumDate={new Date} // Đặt ngày tối thiểu có thể chọn cho DatePicker
            maximumDate={endDate ? moment(endDate).toDate() : moment().add(2, 'months').toDate()} // Đặt ngày tối đa có thể chọn cho DatePicker
            onChange={onChangeStartDate}
          />
        )}
      {(errorMessage.postStartDate) && <TextComponent text={errorMessage.postStartDate}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}

      <TouchableOpacity onPress={showEndDatePicker}>
        <TextInput
          label="Ngày kết thúc"
          value={endDate ? moment(endDate).format('YYYY-MM-DD') : ''} // Hiển thị ngày được chọn dưới dạng YYYY-MM-DD
          // onBlur={() => handleValidate(formData.postEndDate,'postenddate')}
          style={styles.input}
          editable={false} // Người dùng không thể chỉnh sửa trực tiếp
          error={errorMessage.postEndDate? true : false}
          theme={{
            colors: {
              error: appColors.danger, 
            },
          }}
        />      
      </TouchableOpacity>
        {isEndDatePickerVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={endDate ? endDate : new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            minimumDate={minEndDate} // Đặt ngày tối thiểu có thể chọn cho DatePicker
            maximumDate={moment(startDate).add(2, 'months').toDate()} // Đặt ngày tối đa có thể chọn cho DatePicker
            onChange={onChangeEndDate}
          />
        )}
      {(errorMessage.postEndDate) && <TextComponent text={errorMessage.postEndDate}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}

      <TextInput
        label="Số điện thoại"
        value={formData.postPhoneNumber}
        onBlur={() => handleValidate(formData.postPhoneNumber,'postphonenumber')}
        onChangeText={(text) => {
          // Chỉ cho phép cập nhật nếu text mới là số
          const newText = text.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không phải số
          // setFormData({ ...formData, postPhoneNumber: newText });
          // setErrorMessage({...errorMessage, postPhoneNumber: ''})
          handleValidate(newText,'postphonenumber');
        }}        
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        keyboardType="numeric" // Chỉ hiển thị bàn phím số
        error={errorMessage.postPhoneNumber? true : false}
        theme={{
          colors: {
            error: appColors.danger, 
          },
        }}
      />  
      {(errorMessage.postPhoneNumber) && <TextComponent text={errorMessage.postPhoneNumber}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
      
      {
        (formData.postBringItemToWarehouse !== 'Tự đem đến kho') && 
          <TextInput
            label="Địa chỉ"
            value={location?.address}
            // onFocus={() => handleValidate('', 'postaddress')}
            onBlur={() => {
              // handleValidate('', 'postaddress');
              handleBlur();
              
            }}
            editable={false}
            selection={{start: 0, end: 0}}
            onChangeText={(text) =>{ 
              setFormData({ ...formData, postAddress: text });
              setErrorMessage({...errorMessage, postAddress: ''})
              // handleValidate(text,'postaddress');

            }}
            multiline
            style={styles.input}
            underlineColor="gray" // Màu của gạch chân khi không focus
            activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
            error={errorMessage.postAddress? true : false}        

            // textAlignVertical="top"
            // textAlign="left"
            // scrollEnabled={true}
            theme={{
              colors: {
                error: appColors.danger, 
              },
            }}
          />
        }
      {(errorMessage.postAddress) && <TextComponent text={errorMessage.postAddress}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}

      {
        (location && formData.postBringItemToWarehouse !== 'Tự đem đến kho')
        &&
        <ShowMapComponent
          location={location}
          setLocation={setLocation}
          useTo={'setPostAddress'}
        />
      }

      <TextInput
        label="Phương thức cho"
        value={formData.postGiveMethod}
        // onChangeText={(text) => setFormData({ ...formData, postAddress: text })}
        style={styles.inputForGiveMethod}
        editable={false}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      />
      {(errorMessage.postGiveMethod) && <TextComponent text={errorMessage.postGiveMethod}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}


      {formData.postBringItemToWarehouse &&
      <TextInput
        label="Phương thức đem món đồ đến kho"
        value={formData.postBringItemToWarehouse}
        // onChangeText={(text) => setFormData({ ...formData, postAddress: text })}
        style={styles.inputForGiveMethod}
        editable={false}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      />
      }
      {/* Thêm các trường input khác tương tự */}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    marginBottom: 40,
    color: 'black',
    fontWeight: 'bold'
  },
  inputForGiveMethod:{
    width: '100%',
    marginTop: 20,
    backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
    fontSize: 14,
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    marginBottom: 10
  },
  datePicker: {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: 'black',
  },

  inputDescription: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'transparent', // Đặt nền trong suốt để loại bỏ hiệu ứng nền mặc định
    fontSize: 14,
  }
});

export default StepTwo;