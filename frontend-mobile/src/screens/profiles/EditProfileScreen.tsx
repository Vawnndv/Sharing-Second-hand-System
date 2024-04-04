import { Fontisto, SimpleLineIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import authenticationAPI from '../../apis/authApi';
import { AvatarComponent, ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SpaceComponent } from '../../components';
import AvatarUpload from '../../components/AvatarUpload';
import { appColors } from '../../constants/appColors';
import { LoadingModal, UploadModal } from '../../modals';
import { ErrorMessages } from '../../models/ErrorMessages';
import { Validator } from '../../utils/Validation';
import { ProfileModel } from '../../models/ProfileModel';
import { PickImage, TakePhoto, UploadImageToAws3, getCameraPermission, getGallaryPermission } from '../../ImgPickerAndUpload';
import { globalStyles } from '../../styles/globalStyles';
import userAPI from '../../apis/userApi';

const initValue = {
  email: '',
  username: '',
  phone: '',
  address: '',
  confirmPassword: '',
};


// for uploading image to backend ;
const FormData = global.FormData;

const EditProfileScreen = ({navigation, route}: any) => {
  const {profile}: {profile:ProfileModel} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [values, setValues] = useState({email: profile.email, username : profile.username, phonenumber : profile.phonenumber});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(initValue);
  const [errorRegister, setErrorRegister] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false)
  const [hasCameraPermission, setHasCameraPermission] = useState(false)

  useEffect(() => {
    if (
      errorMessage.username ||
      errorMessage.phonenumber || !values.username || !values.phonenumber
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
  
  const handleRegister = async () => {
    const {url} = await UploadImageToAws3(image);
    console.log(url);
    setErrorMessage(initValue);
    setIsLoading(true);
    try {
      const res = await userAPI.HandleUser('/change-profile', 
        {
          email: values.email, 
          username: values.username,
          phonenumber: values.phonenumber,
          avatar: url ?? null,
        }
        , 'post');
      setIsLoading(false);
      navigation.navigate('ProfileScreen', {
        isUpdated: true,
      })
      setIsDisable(true);
      setErrorRegister('');
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

  return (
    <>
      <ContainerComponent back title={'Edit Profile'}>
        <SectionComponent styles={[globalStyles.center]}>
          <AvatarComponent
            avatar={image ? image.uri : profile.avatar }
            username={profile.username ? profile.username : profile.email} 
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
          />
          <SpaceComponent height={21} />
          <InputComponent
            value={values.email}
            editable={false}
            placeholder="Email"
            onChange={val => handleChangeValue('', val)}
            affix={<Fontisto name="email" size={22} color={appColors.gray} />}
          />
          <InputComponent
            value={values.username}
            placeholder="Họ và tên"
            onChange={val => handleChangeValue('username', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
            onEnd={() => formValidator('username')}
            error={errorMessage['username']}
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
        </SectionComponent>
        <SpaceComponent height={16} />
          <SectionComponent>
            <ButtonComponent
              onPress={handleRegister}
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
