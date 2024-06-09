import { Fontisto, SimpleLineIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import authenticationAPI from '../../apis/authApi';
import { AvatarComponent, ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import AvatarUpload from '../../components/AvatarUpload';
import { appColors } from '../../constants/appColors';
import { LoadingModal, UploadModal } from '../../modals';
import { ErrorMessages } from '../../models/ErrorMessages';
import { Validator } from '../../utils/Validation';
import { ProfileModel } from '../../models/ProfileModel';
import { PickImage, TakePhoto, UploadImageToAws3, getCameraPermission, getGallaryPermission } from '../../ImgPickerAndUpload';
import { globalStyles } from '../../styles/globalStyles';
import userAPI from '../../apis/userApi';
import { useDispatch } from 'react-redux';
import { updateAuth } from '../../redux/reducers/authReducers';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

const initValueError = {
  email: '',
  firstname: '',
  lastname: '',
  phone: '',
  address: '',
  dob: '',
};


// for uploading image to backend ;

const EditProfileScreen = ({navigation, route}: any) => {
  
  const {profile}: {profile:ProfileModel} = route.params;
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [values, setValues] = useState({email: profile.email, firstname: profile.firstname, lastname: profile.lastname, phonenumber : profile.phonenumber, dob: profile.dob});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(initValueError);
  const [errorRegister, setErrorRegister] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [date, setDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (
      errorMessage.firstname || errorMessage.lastname ||
      errorMessage.phonenumber || !values.firstname || !values.lastname || !values.phonenumber
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [errorMessage, values]);

  useEffect(()  => {
        
    const getPermission = async () => {
        await getCameraPermission(setHasCameraPermission);
        await getGallaryPermission(setHasGalleryPermission);
    }

    getPermission()
    
}, [])

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;
    
    setValues(data);
  };

  const formValidator = (key: keyof ErrorMessages) => {
    setErrorMessage(Validator.Validation(key, errorMessage, values));
  };
  
  const handleChangeProfile = async () => {
    setIsLoading(true);
    try {
      const {url} = image ? await UploadImageToAws3(image) : profile.avatar;
      const res = await userAPI.HandleUser('/change-profile', 
        {
          email: values.email, 
          firstname: values.firstname,
          lastname: values.lastname,
          phonenumber: values.phonenumber,
          avatar: url ?? profile.avatar,
          dob: values.dob,
        }
        , 'post');
      console.log(res, 'abcdddddd');
      dispatch(updateAuth(res.data));
      setIsLoading(false);
      navigation.navigate('ProfileScreen', {
        isUpdated: true,
      })
      setIsDisable(true);
      setErrorRegister('');
      setErrorMessage(initValueError);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorRegister(error.message);
      } else {
        setErrorRegister("Network Error");
      }
      setIsLoading(false);
      setIsDisable(false);
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

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    setDatePickerVisibility(Platform.OS === 'ios');
    if (event.type === 'dismissed') {
      // If the picker was dismissed, set date to ''
      setDate(null);
      setValues({ ...values, dob: '' });
      setErrorMessage({...errorMessage, dob: 'Vui lòng chọn ngày sinh của bạn'});
    } else {
      const currentDate = selectedDate ? selectedDate : date;
      setDate(currentDate);
      setValues({ ...values, dob: currentDate ? moment(currentDate).format('YYYY-MM-DD') : '' }); // Update formData
      setErrorMessage({ ...errorMessage, dob: '' });
    }
  };

  const showdatePicker = () => {
    setDatePickerVisibility(true);
  };

  return (
    <>
      <ContainerComponent back title={'Edit Profile'} isScroll>
        <SectionComponent styles={[globalStyles.center]}>
          <AvatarComponent
            avatar={image ? image.uri : profile.avatar }
            username={profile.lastname ? profile.lastname : profile.email} 
            onButtonPress={() => setModalVisible(true)} 
            size={150}
            isEdit 
            isBorder
          />
          <UploadModal 
            modalVisible={modalVisible}
            onBackPress={() => { setModalVisible(false); }}
            onCameraPress={() => TakePhoto(hasCameraPermission,setImage,() => setModalVisible(false))} 
            onGalleryPress={() => PickImage(hasGalleryPermission,false,setImage, () => setModalVisible(false))}
            onRemovePress={() => removeImage()}
            isLoading={false}
            title='Profile photo'    
          />
        </SectionComponent>
        <SpaceComponent height={21} />
        <SectionComponent>
          <InputComponent
            value={values.email}
            editable={false}
            placeholder="Email"
            onChange={val => handleChangeValue('', val)}
            affix={<Fontisto name="email" size={22} color={appColors.gray} />}
          />
          <InputComponent
            value={values.firstname}
            placeholder="Họ của bạn"
            onChange={val => handleChangeValue('firstname', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
            onEnd={() => formValidator('firstname')}
            error={errorMessage['firstname']}
          />
          <InputComponent
            value={values.lastname}
            placeholder="Tên của bạn"
            onChange={val => handleChangeValue('lastname', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
            onEnd={() => formValidator('lastname')}
            error={errorMessage['lastname']}
          />
          <InputComponent
            value={values.phonenumber}
            placeholder="Số điện thoại"
            onChange={val => handleChangeValue('phonenumber', val)}
            allowClear
            affix={<SimpleLineIcons name="phone" size={22} color={appColors.gray} />}
            onEnd={() => formValidator('phonenumber')}
            error={errorMessage['phonenumber']}
          />     
          {/* <InputComponent
            value={values.address}
            placeholder="Địa chỉ"
            onChange={val => handleChangeValue('address', val)}
            allowClear
            affix={<SimpleLineIcons name="location-pin" size={22} color={appColors.gray} />}
            onEnd={() => formValidator('address')}
            error={errorMessage['address']}
          /> */}

      <TouchableOpacity onPress={showdatePicker}>
        <InputComponent
          value={values.dob ? moment(values.dob).format('DD-MM-YYYY') : ''}
          placeholder="Ngày sinh"
          onChange={val => handleChangeValue('', val)}
          editable={false}
          affix={<Fontisto name="date" size={22} color={appColors.gray} />}
          onEnd={() => formValidator('dob')}
          error={errorMessage['dob']}
        />    
      </TouchableOpacity>
          {isDatePickerVisible && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date ? date : new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              // minimumDate={mindate} // Đặt ngày tối thiểu có thể chọn cho DatePicker
              // maximumDate={moment(startDate).add(2, 'months').toDate()} // Đặt ngày tối đa có thể chọn cho DatePicker
              onChange={onChangeDate}
            />
          )}
        </SectionComponent>
        <SpaceComponent height={16} />
        {errorRegister ? (
        <SectionComponent>
          <TextComponent text={errorRegister} color={appColors.danger} />
        </SectionComponent>
      ) : (
        <SpaceComponent height={16} />
      )}
        <SectionComponent>
          <ButtonComponent
            onPress={handleChangeProfile}
            text="SAVE"
            type="primary"
            disable={isDisable}           
          />
        </SectionComponent>
      </ContainerComponent>
      <LoadingModal visible={isLoading} />
    </>
  )
}


export default EditProfileScreen
