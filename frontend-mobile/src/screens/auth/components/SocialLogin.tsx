import React from 'react'
import { ButtonComponent, SectionComponent, SpaceComponent, TextComponent } from '../../../components'
import { appColors } from '../../../constants/appColors'
import { fontFamilies } from '../../../constants/fontFamilies'
// import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { Google } from 'iconsax-react-native'

// GoogleSignin.configure({
//   webClientId: '207453487106-codnbkrd7v3mu6gljp17n9u521vm35ep.apps.googleusercontent.com',
// });

const SocialLogin = () => {

  const handleLoginWithGoogle = async () => {
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
        onPress={handleLoginWithGoogle}
        type="primary"
        color={appColors.white}
        textColor={appColors.text}
        text="Login with Google"
        textFont={fontFamilies.regular}
        icon={<Google />}
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
    </SectionComponent>
  )
}

export default SocialLogin