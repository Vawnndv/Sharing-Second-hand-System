import { Fontisto, SimpleLineIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import authenticationAPI from '../../apis/authApi';
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SpaceComponent } from '../../components';
import AvatarUpload from '../../components/AvatarUpload';
import { appColors } from '../../constants/appColors';
import { UploadModal } from '../../modals';
import { ErrorMessages } from '../../models/ErrorMessages';
import { Validator } from '../../utils/Validation';
import { ProfileModel } from '../../models/ProfileModel';

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
  const [image, setImage] = useState<any>();
  const [savingChanges, setSavingChanges] = useState(false);
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(initValue);
  const [errorRegister, setErrorRegister] = useState('');
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if (
      errorMessage.username ||
      errorMessage.phone || errorMessage.address  || !values.username || !values.phone || !values.address 
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [errorMessage, values]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;
    
    setValues(data);
  };

  const formValidator = (key: keyof ErrorMessages) => {
    setErrorMessage(Validator.Validation(key, errorMessage, values));
  };
  
  const handleRegister = async () => {
    setErrorMessage(initValue);
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication('/verification', {phone: values.phone}, 'post');
      setIsLoading(false);
      navigation.navigate('VerificationScreen', {
        code: res.data.code,
        ...values,  
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

  const uploadImage = async (mode: string) => {
    try {
      let result: any = {};
      if (mode === 'gallery') {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        console.log(result.assets[0].uri, 'link')
        console.log(result.assets[0], 'imageurl')
        await saveImage(result.assets[0]);
      }
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  };

  const saveChanges = async () => {
    try {
      setSavingChanges(true);

      setSavingChanges(false);
      navigation.navigate("Profile");
    } catch ({message}: any) {
      alert(message);
      setSavingChanges(false);
    }
  }

  const removeImage = async () => {
    try {
      saveImage('');
      setModalVisible(false);
    } catch ({ message}: any) {
      alert(message);
      setModalVisible(false);
    }
  };

  const saveImage = async (image: any) => {
    try {
      // update display image
      setImage(image);

      // make api call to save
      sendToBackend();

      setModalVisible(false);
    } catch (error) {
      throw error;
    }
  };

  const sendToBackend = async () => {
    try {
      const formData: any = new FormData();
      // formData.append('file', {
      //   uri: image,
      //   type: 'image/png',
      //   name: 'profile-image',
      // });


      formData.append('file', image)


      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        TransformStream: () => {
          return formData;
        },
      };

      // await axios.post(`${appInfo.BASE_URL}`, formData, config);
      alert("success");
    } catch (error) {
      throw error;
    }
  };

  return (
    <ContainerComponent back title={'Edit Profile'}>
      <SectionComponent>
        <AvatarUpload onButtonPress={() => setModalVisible(true)} uri={image} aviOnly={false} />
        <UploadModal 
          modalVisible={modalVisible}
          onBackPress={() => { setModalVisible(false); }}
          onCameraPress={() => uploadImage('camera')} 
          onGalleryPress={() => uploadImage('gallery')}
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
          value={values.phone}
          placeholder="Số điện thoại"
          onChange={val => handleChangeValue('phone', val)}
          allowClear
          affix={<SimpleLineIcons name="phone" size={22} color={appColors.gray} />}
          onEnd={() => formValidator('phone')}
          error={errorMessage['phone']}
        />     
        <InputComponent
          value={values.address}
          placeholder="Địa chỉ"
          onChange={val => handleChangeValue('address', val)}
          allowClear
          affix={<SimpleLineIcons name="location-pin" size={22} color={appColors.gray} />}
          onEnd={() => formValidator('address')}
          error={errorMessage['address']}
        />
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
  )
}

export default EditProfileScreen
