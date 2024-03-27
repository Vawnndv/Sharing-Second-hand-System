import { View, Text, Switch, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { ArrowRight, Lock, Sms } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authenticationAPI from '../../apis/authApi';
import { useDispatch } from 'react-redux';
import { Validate } from '../../utils/Validation';
import { addAuth } from '../../redux/reducers/authReducers';
import { LoadingModal } from '../../modals';
import { globalStyles } from '../../styles/globalStyles';

interface ErrorMessages {
  email: string;
  password: string;
}

const initValue = {
  email: '',
  password: '',
};

const LoginScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isRemember, setIsRemember] = useState(true);
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(initValue);

  const dispatch = useDispatch();

  useEffect(() => {
    const emailValidation = Validate.email(values.email);

    if (!values.email || !values.password || !emailValidation || errorMessage.email || errorMessage.password) {
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

  const formValidator = (key: string) => {
    let updatedErrorMessage = {...errorMessage}; // Tạo một bản sao mới của errorMessage
    
    switch (key) {
      case 'email':
        if (!values.email) {
          updatedErrorMessage.email = 'Email is required';
        } else if (!Validate.email(values.email)) {
          updatedErrorMessage.email = 'Email is not invalid';
        } else {
          updatedErrorMessage.email = '';
        }
        break;
  
      case 'password':
        updatedErrorMessage.password = !values.password ? 'Password is required!!!' : '';
        break;
    }
  
    setErrorMessage(updatedErrorMessage); // Sử dụng bản sao mới của errorMessage
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const emailValidation = Validate.email(values.email );

    if (emailValidation) {
      try {
        const res = await authenticationAPI.HandleAuthentication(
          '/login',
          {email: values.email , password: values.password},
          'post'
        );
        console.log(res);

        dispatch(addAuth(res.data));

        await AsyncStorage.setItem('auth', isRemember ? JSON.stringify(res.data) : values.email);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      Alert.alert('email is not correct!!!');
    }
  };

  return (
    <ContainerComponent isImageBackground isScroll>
      <SectionComponent 
        styles={{
          justifyContent: 'center',
          marginTop: 75,
        }}
      >
        <TextComponent text="Sign In" title size={24} color={appColors.primary} styles={{textAlign: 'center'}} />
        <SpaceComponent height={21} />
        <InputComponent
          value={values.email }
          placeholder="Email"
          onChange={val => handleChangeValue('email', val)}
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
          onEnd={() => formValidator('email')}
          error={errorMessage['email'] ? true : false}
        />
        {errorMessage['email'] && <TextComponent text={errorMessage['email']}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
        <InputComponent
          value={values.password}
          placeholder="Password"
          onChange={val => handleChangeValue('password', val)}
          isPassword
          allowClear
          affix={<Lock size={22} color={appColors.gray} />}
          onEnd={() => formValidator('password')}
          error={errorMessage['password'] ? true : false}
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
            <TextComponent text="Remember me" />
          </RowComponent>
          <ButtonComponent 
            text="Forgot password?" 
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            type="text"
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          disable={isDisable}
          onPress={handleLogin}
          text="SIGN IN"
          type='primary'
          iconFlex="right"
          icon={
            <View style={[
              globalStyles.iconContainer,
              {
                backgroundColor: isDisable  
                  ? appColors.gray 
                  : appColors.primary
              },
            ]}>
              <ArrowRight size={18} color={appColors.white} />
            </View>
          }
        />
      </SectionComponent>
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Don't have an account? " />
          <ButtonComponent 
            type="link" 
            text="Sign up" 
            onPress={() => navigation.navigate('RegisterSCreen')} 
          />
        </RowComponent>
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>

  )
}

export default LoginScreen