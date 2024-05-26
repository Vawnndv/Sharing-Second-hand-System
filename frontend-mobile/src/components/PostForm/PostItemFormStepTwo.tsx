import React, { useEffect, useRef, useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, StyleSheet, Text, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ProfileModel } from '../../models/ProfileModel';
import { authSelector } from '../../redux/reducers/authReducers';
import axios from 'axios';
import { appInfo } from '../../constants/appInfos';
import { ErrorProps } from './MultiStepForm';
import { appColors } from '../../constants/appColors';
import TextComponent from '../TextComponent';
import ShowMapComponent from '../ShowMapComponent';

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
}


const StepTwo: React.FC<StepTwoProps> = ({ setStep, formData, setFormData, errorMessage, setErrorMessage, location, setLocation }) => {

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [minEndDate, setMinEndDate] = useState<Date>(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [profile, setProfile] = useState<ProfileModel>();
  const [isLoading, setIsLoading] = useState(false);

  const auth = useSelector(authSelector);

  const textInputRef = useRef<any>(null);


  useEffect( () => {
    const fetchUserData = async () =>{
        try {
  
          const res = await axios.get(`${appInfo.BASE_URL}/user/get-profile/?userId=${auth.id}`)
          // const res = await postsAPI.HandlePost(
          //   `/${postID}`,
          // );
          if (!res) {
            throw new Error('Failed to fetch user info'); // Xử lý lỗi nếu request không thành công
          }

          setProfile(res.data);
          setFormData({
            ...formData,
            postAddress: res.data.data.address,
            postPhoneNumber: res.data.data.postPhoneNumber,
          });
          } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setIsLoading(false);
        }
    }

    const fetchUserAddressData = async () =>{
      try {

        const response = await axios.get(`${appInfo.BASE_URL}/user/get-user-address?userId=${auth.id}`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!response) {
          throw new Error('Failed to fetch user info'); // Xử lý lỗi nếu request không thành công
        }

        // console.log('Location Give',response.data)
        setLocation({
          addressid: response.data.data.addressid,
          address: response.data.data.address,
          latitude: parseFloat(response.data.data.latitude),
          longitude: parseFloat(response.data.data.longitude)
        });
        // console.log(response.data)
        
        } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoading(false);
      }
    }
   
            
    fetchUserData();
    fetchUserAddressData()
  
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
      } else {
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <ScrollView style = {styles.container}>
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
        style={styles.input}
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
            maximumDate={moment().add(2, 'months').toDate()} // Đặt ngày tối đa có thể chọn cho DatePicker
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
        value={profile?.phonenumber}
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
            selection={{start: 0, end: 0}}
            onChangeText={(text) =>{ 
              setFormData({ ...formData, postAddress: text });
              setErrorMessage({...errorMessage, postAddress: ''})
              // handleValidate(text,'postaddress');

            }}
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
    marginTop: 20,
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
});

export default StepTwo;