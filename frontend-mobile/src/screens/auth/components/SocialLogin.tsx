import React, { useEffect, useState } from 'react'
import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from '../../../components'
import { appColors } from '../../../constants/appColors'
import { fontFamilies } from '../../../constants/fontFamilies'
// import { GoogleSignin } from '@react-native-google-signin/google-signin'
// import { Google } from 'iconsax-react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, Text, View } from 'react-native'
// GoogleSignin.configure({
//   webClientId: '207453487106-codnbkrd7v3mu6gljp17n9u521vm35ep.apps.googleusercontent.com',
// });


WebBrowser.maybeCompleteAuthSession();

const SocialLogin = () => {
  const [userInfo, setUserInfo] = useState(null);
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
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        console.log(response)
        await getUserInfo(response.authentication?.accessToken);
      }
    } else {
      // setUserInfo(JSON.parse(user));
      console.log(response)

    }
    // await GoogleSignin.hasPlayServices({
    //   showPlayServicesUpdateDialog: true,
    // });

    // try {
    //   await GoogleSignin.hasPlayServices();

    //   const userInfo = await GoogleSignin.signIn();

    //   console.log(userInfo.user);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const getUserInfo = async (token: any) => {
    console.log(token, '123313');
    if (!token) return;

    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}`}
        }
      );

      const user = await response.json();
      // await AsyncStorage.setItem("@user", JSON.stringify(user));
      console.log(user)
      setUserInfo(user);
    } catch (error) {

    }
  }

  return (
    <SectionComponent>
      <TextComponent 
        styles={{textAlign: 'center'}} 
        text="OR" 
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
        text="Login with Google"
        textFont={fontFamilies.regular}
        // icon={<Google />}
        iconFlex="left"
      />
      {/* <Button title='delete local storage' onPress={() => AsyncStorage.removeItem("@user")} /> */}
      <Text>{JSON.stringify(userInfo)}</Text>
      {/* <ButtonComponent 
        type="primary"
        color={appColors.white}
        textColor={appColors.text}
        text="Login with Facebook"
        textFont={fontFamilies.regular}
        icon={<Facebook />}
        iconFlex="left"
      /> */}
    </SectionComponent>
  )
}

export default SocialLogin