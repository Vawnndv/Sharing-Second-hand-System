import React, { useEffect, useState } from 'react';
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

interface FormData {
  postTitle: string;
  postDescription: string;
  postStartDate: string;
  postEndDate: string;
  postPhoneNumber: string
  postAddress: string;
  postGiveMethod?: string;
  
  // Định nghĩa thêm các thuộc tính khác ở đây nếu cần
}

interface StepTwoProps {
  setStep: (step: number) => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  errorMessage: ErrorProps;
  setErrorMessage: (errorMessage: ErrorProps) => void;
}


const StepTwo: React.FC<StepTwoProps> = ({ setStep, formData, setFormData, errorMessage, setErrorMessage }) => {

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [minEndDate, setMinEndDate] = useState<Date>(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [profile, setProfile] = useState<ProfileModel>();
  const [isLoading, setIsLoading] = useState(false);


  const auth = useSelector(authSelector);

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
          } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setIsLoading(false);
        }
    }

    fetchUserData();
  
  },[] )

  useEffect(() =>{
    if(profile){
      setFormData({ ...formData, postPhoneNumber: profile.phonenumber ?? '', postAddress: profile.address ?? ''});
    }

  },[profile])
  
  useEffect(() => {
    if (startDate) {
      setMinEndDate(startDate);
    }
  }, [startDate]);



  const onChangeStartDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate ? selectedDate : startDate;
    setStartDatePickerVisibility(Platform.OS === 'ios');
    setStartDate(currentDate);
    setFormData({ ...formData,  postStartDate: moment(currentDate).format('YYYY-MM-DD') });
    setErrorMessage({...errorMessage, postStartDate: ''});
  };
  
  const onChangeEndDate = (event: any, selectedDate: Date | undefined) => {

    if (!startDate) {
      alert();
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
    setEndDatePickerVisibility(true);
  };


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
        onChangeText={(text) => {
          setFormData({ ...formData, postTitle: text });
          setErrorMessage({...errorMessage, postTitle: ''});
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
        onChangeText={(text) => {
          setFormData({ ...formData, postDescription: text });
          setErrorMessage({...errorMessage, postDescription: ''});
        }}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        multiline={true} // Cho phép nhập nhiều dòng văn bản
        numberOfLines={1} // Số dòng tối đa hiển thị trên TextInput khi không focus
      />  
      {(errorMessage.postDescription) && <TextComponent text={errorMessage.postDescription}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}

      <TouchableOpacity onPress={showStartDatePicker}>
        <TextInput
          label="Ngày bắt đầu"
          value={startDate ? moment(startDate).format('YYYY-MM-DD') : ''} // Hiển thị ngày được chọn dưới dạng YYYY-MM-DD
          style={styles.input}
          editable={false} // Người dùng không thể chỉnh sửa trực tiếp
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
          style={styles.input}
          editable={false} // Người dùng không thể chỉnh sửa trực tiếp
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
        onChangeText={(text) => {
          // Chỉ cho phép cập nhật nếu text mới là số
          const newText = text.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không phải số
          setFormData({ ...formData, postPhoneNumber: newText });
          setErrorMessage({...errorMessage, postPhoneNumber: ''})
        }}        
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
        keyboardType="numeric" // Chỉ hiển thị bàn phím số
      />  
      {(errorMessage.postPhoneNumber) && <TextComponent text={errorMessage.postPhoneNumber}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}

      <TextInput
        label="Địa chỉ"
        value={profile?.address}
        onChangeText={(text) =>{ 
          setFormData({ ...formData, postAddress: text });
          setErrorMessage({...errorMessage, postAddress: ''})
        }}
        style={styles.input}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      />
      {(errorMessage.postAddress) && <TextComponent text={errorMessage.postAddress}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}

      <TextInput
        label="Phương thức cho"
        value={formData.postGiveMethod}
        // onChangeText={(text) => setFormData({ ...formData, postAddress: text })}
        style={styles.input}
        editable={false}
        underlineColor="gray" // Màu của gạch chân khi không focus
        activeUnderlineColor="blue" // Màu của gạch chân khi đang focus
      />
      {(errorMessage.postGiveMethod) && <TextComponent text={errorMessage.postGiveMethod}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}

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
    marginBottom: 20,
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