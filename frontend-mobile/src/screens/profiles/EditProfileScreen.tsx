import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ContainerComponent } from '../../components';
import AvatarUpload from '../../components/AvatarUpload';
import { UploadModal } from '../../modals';
import { ProfileModel } from '../../models/ProfileModel';
;

const EditProfileScreen = ({navigation, route}: any) => {
  const {profile}: {profile:ProfileModel} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string>('');

  const uploadImage = async () => {
      console.log('ok')
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('hi', result)

      if (!result.canceled) {
        console.log('ok', result)
        await saveImage(result.assets[0].uri);
      }
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
      setModalVisible(false);
    }
  };

  const saveImage = async (image: string) => {
    try {

      setImage(image);
      setModalVisible(false);
    } catch (error) {
      throw error;
    }
  };


  const pickImage = () => {
    console.log('pickup');
  }

  return (
    <ContainerComponent back title={profile.username}>
      <AvatarUpload onButtonPress={() => setModalVisible(true)} uri={image} aviOnly={false} />
      <UploadModal 
        modalVisible={modalVisible}
        onBackPress={() => { setModalVisible(false); }}
        onCameraPress={uploadImage} 
        onGalleryPress={pickImage}
        isLoading={false}    
      />
    </ContainerComponent>
  )
}

export default EditProfileScreen
