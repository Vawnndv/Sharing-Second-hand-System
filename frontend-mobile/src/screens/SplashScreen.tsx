import { View, Text, ImageBackground, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import SpaceComponent from '../components/SpaceComponent'
import { appInfo } from '../constants/appInfos';
import { appColors } from '../constants/appColors';

const SplashScreen = () => {
  return (
    <ImageBackground 
      source={require('../../assets/images/splash-img.png')} 
      style={{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
        }}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={{
            width: appInfo.sizes.WIDTH,
            resizeMode: 'contain',            
          }}
        />
        <SpaceComponent height={16} />
        <ActivityIndicator color={appColors.gray} size={22} />
    </ImageBackground>
  );
};

export default SplashScreen;