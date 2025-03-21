import React, { useEffect, useState } from 'react'
import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from '../../../components'
import { appColors } from '../../../constants/appColors'
import { fontFamilies } from '../../../constants/fontFamilies'
// import { GoogleSignin } from '@react-native-google-signin/google-signin'
// import { Google } from 'iconsax-react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { Button, Text, View } from 'react-native'
import authenticationAPI from '../../../apis/authApi'
import { useDispatch } from 'react-redux'
import { addAuth } from '../../../redux/reducers/authReducers'
import { LoadingModal } from '../../../modals'
import { usePushNotifications } from '../../../utils/usePushNotification'
import { AntDesign } from '@expo/vector-icons'

import {GoogleIcon} from '../../../../assets/svgs';

WebBrowser.maybeCompleteAuthSession();

const SocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '955016832347-mul7ulp39flkmpmmp55c9oah2er83lam.apps.googleusercontent.com',
    androidClientId: '955016832347-tccm78l1snm6hs9dt314slgq59kftdp8.apps.googleusercontent.com',
    webClientId: '955016832347-5ceu6unptu6uc2mfm28qb6hqkqqacks5.apps.googleusercontent.com',
    // scopes: ['profile', 'email']
  })

  useEffect(() => {
    handleLoginWithGoogle()
  }, [response])
  
  const handleLoginWithGoogle = async () => {
    if (response?.type === "success") {
      await getUserInfo(response.authentication?.accessToken);
    } 
  };

  const getUserInfo = async (token: any) => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}`}
        }
      );

      const user = await response.json();
      if (user) {
        setIsLoading(true);
        const data = {
          firstname: user.given_name,
          lastname: user.family_name,
          email: user.email,
          avatar: user.picture,
        };

        const res: any = await authenticationAPI.HandleAuthentication(
          '/google-signin',
          data,
          'post',
        );

        dispatch(addAuth(res.data));

        await AsyncStorage.setItem('auth', JSON.stringify(res.data));
        await usePushNotifications.registerForPushNotificationsAsync();

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <SectionComponent>
      <TextComponent 
        styles={{textAlign: 'center'}} 
        text="Hoặc" 
        color={appColors.gray4} 
        size={16} 
        font={fontFamilies.medium} 
      />
      <SpaceComponent height={16} />
      <ButtonComponent 
        onPress={() => promptAsync()}
        type="primary"
        color={appColors.white}
        textColor={appColors.text}
        text="Đăng nhập với Google"
        textFont={fontFamilies.regular}
        icon={
          <GoogleIcon />
        }
        iconFlex="left"
      />
      {/* <ButtonComponent 
        type="primary"
        color={appColors.white}
        textColor={appColors.text}
        text="Login with Facebook"
        textFont={fontFamilies.regular}
        icon={<Facebook />}
        iconFlex="left"
      /> */}
      <LoadingModal visible={isLoading} />
    </SectionComponent>
  )
}

export default SocialLogin