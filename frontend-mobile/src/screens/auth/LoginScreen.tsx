import { View, Text, Switch, Alert, Button } from 'react-native'
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
import { ExpoPushToken } from 'expo-notifications';

const initValue = {
  email: '',
  password: '',
};

const sendNotification = async (expoPushToken: ExpoPushToken | undefined) => {
  console.log("Sending push notification...");

  // notification message
  const message = {
    to: expoPushToken?.data,
    sound: "default",
    title: "My first push notification!",
    body: "This is my first push notification made with expo rn app",
  };
  console.log(expoPushToken?.data)

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

const LoginScreen = ({navigation}: any) => {
  const {expoPushToken, notification} = usePushNotifications();

  const data = JSON.stringify(notification, undefined, 2);
  console.log("token: ", expoPushToken);
  console.log("data: ", data);
  const [values, setValues] = useState(initValue);
  const [isRemember, setIsRemember] = useState(true);
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
      console.log(res.data)
      dispatch(addAuth(res.data));
      setIsDisable(true);
      setErrorLogin('');
      await AsyncStorage.setItem('auth', isRemember ? JSON.stringify(res.data) : JSON.stringify(values.email));
      setIsLoading(false);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorLogin(error.message);
      } else {
        setErrorLogin("Network Error");
      }
      setIsLoading(false);
      setIsDisable(false);
    }
  }; 

  return (
    <ContainerComponent isImageBackground isScroll>

    <View style={{ marginTop: 100, alignItems: "center" }}>
        <Text style={{ marginVertical: 30 }}>Expo RN Push Notifications</Text>
      <Button title="Send push notification" onPress={() => sendNotification(expoPushToken)} />
    </View>
      <SectionComponent 
        styles={{
          justifyContent: 'center',
          marginTop: 75,
        }}
      >
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
            />
            <SpaceComponent width={4} />
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
          text="ĐĂNG NHẬP"
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
          <TextComponent text="bạn chưa có tài khoản? " />
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

export default LoginScreen