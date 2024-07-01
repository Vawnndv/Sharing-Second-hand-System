import { View, Text, Switch, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { ArrowRight, Lock, Sms } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authenticationAPI from '../../apis/authApi';
import { useDispatch } from 'react-redux';
import { Validator } from '../../utils/Validation';
import { addAuth } from '../../redux/reducers/authReducers';
import { LoadingModal } from '../../modals';
import { globalStyles } from '../../styles/globalStyles';
import { ErrorMessages } from '../../models/ErrorMessages';
import SocialLogin from './components/SocialLogin';
import { usePushNotifications } from '../../utils/usePushNotification';

const initValue = {
  email: '',
  password: '',
};

const LoginScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isRemember, setIsRemember] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(initValue);
  const [errorLogin, setErrorLogin] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {

    if (!values.email || !values.password || errorMessage.email || errorMessage.password) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [values, errorMessage]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;
    
    setValues(data);
  };

  const formValidator = (key: keyof ErrorMessages) => {
    setErrorLogin('');
    let updatedErrorMessage = Validator.Validation(key, errorMessage, values);
    setErrorMessage(updatedErrorMessage); // Sử dụng bản sao mới của errorMessage
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const res = await authenticationAPI.HandleAuthentication(
        '/login',
        {platform: 'mobile', email: values.email , password: values.password},
        'post'
      );
      dispatch(addAuth(res.data));
      setIsDisable(true);
      setErrorLogin('');
      await AsyncStorage.setItem('auth', JSON.stringify(res.data));
      await usePushNotifications.registerForPushNotificationsAsync();
      setIsLoading(false);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorLogin(error.message);
      } else {
        setErrorLogin("Lỗi mạng");
      }
      setIsLoading(false);
      setIsDisable(false);
    }
  }; 

  return (
    <ContainerComponent isScroll>
      <SectionComponent 
        styles={{
          justifyContent: 'center',
          marginTop: 25,
        }}
      >
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/images/retreasure_title_logo.png")} style={styles.logo} />
        </View>
        <TextComponent text="Đăng nhập" title size={24} color={appColors.primary} styles={{textAlign: 'center'}} />
        <SpaceComponent height={21} />
        <InputComponent
          value={values.email }
          placeholder="Email"
          onChange={val => handleChangeValue('email', val)}
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
          onEnd={() => formValidator('email')}
          error={errorMessage['email']}
        />
        <InputComponent
          value={values.password}
          placeholder="Mật khẩu"
          onChange={val => handleChangeValue('password', val)}
          isPassword
          allowClear
          affix={<Lock size={22} color={appColors.gray} />}
          onEnd={() => formValidator('password')}
          error={errorMessage['password']}
        />
        <RowComponent justify="space-between" styles={{width: '100%', }}>
          <RowComponent onPress={() => setIsRemember(!isRemember)}>
            <Switch
              trackColor={{true: appColors.primary}}
              thumbColor={appColors.white}
              value={isRemember}
              onChange={() => setIsRemember(!isRemember)}
              style={{
                transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
              }}
            />
            <SpaceComponent width={6} />
            <TextComponent text="Lưu tài khoản" />
          </RowComponent>
          <ButtonComponent 
            text="Quên mật khẩu?" 
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            type="text"
          />
        </RowComponent>
      </SectionComponent>
      {errorLogin ? (
        <SectionComponent>
          <TextComponent text={errorLogin} color={appColors.danger} />
        </SectionComponent>
      ) : (
        <SpaceComponent height={16} />
      )}
      <SectionComponent>
        <ButtonComponent
          disable={isDisable}
          onPress={handleLogin}
          text={"ĐĂNG NHẬP"}
          type='primary'
          iconFlex="right"
          icon={
            <View style={[
              globalStyles.iconContainer,
              {
                backgroundColor: isDisable  
                  ? appColors.gray 
                  : appColors.primary2
              },
            ]}>
              <ArrowRight size={18} color={appColors.white} />
            </View>
          }
        />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn chưa có tài khoản? " />
          <ButtonComponent 
            type="link" 
            text="Đăng ký" 
            onPress={() => navigation.navigate('RegisterSCreen')} 
          />
        </RowComponent>
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>

  )
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain'
  }
});

export default LoginScreen