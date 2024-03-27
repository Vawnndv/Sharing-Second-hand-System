import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { Lock, Sms, User } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { LoadingModal } from '../../modals';
import authenticationAPI from '../../apis/authApi';
import { Validate } from '../../utils/Validation';

interface ErrorMessages {
  username: string,
  email: string;
  password: string;
  confirmPassword: string;
}

const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const RegisterScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(initValue);
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if (
      errorMessage.username ||
      errorMessage.email || errorMessage.password || errorMessage.confirmPassword || !values.username || !values.email || !values.password || !values.confirmPassword
        
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

  const formValidator = (key: string) => {
    let updatedErrorMessage = {...errorMessage}; // Tạo một bản sao mới của errorMessage
    
    switch (key) {
      case 'username':
        if (!values.username) {
          updatedErrorMessage.username = 'Username is required!!!';
        } else {
          updatedErrorMessage.username = '';
        }
        break;
  
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
  
      case 'confirmPassword':
        if (!values.confirmPassword) {
          updatedErrorMessage.confirmPassword = 'Please type confirm password';
        } else if (values.confirmPassword !== values.password) {
          updatedErrorMessage.confirmPassword = 'Password is not match';
        } else {
          updatedErrorMessage.confirmPassword = '';
        }
        break;
    }
  
    setErrorMessage(updatedErrorMessage); // Sử dụng bản sao mới của errorMessage
  };
  
  const handleRegister = async () => {
    setErrorMessage(initValue);
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication('/verification', {email: values.email}, 'post');
      console.log(res);
      setIsLoading(false);
      navigation.navigate('VerificationScreen', {
        code: res.data.code,
        ...values,  
      })
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Alert.alert('email is exist! in system!!!');
      setIsDisable(false);
    }
  };

  return (
    <>
      <ContainerComponent isImageBackground isScroll back>
        <SectionComponent>
          <TextComponent text="Sign Up" title size={24} color={appColors.primary} />
          <SpaceComponent height={21} />
          <InputComponent
            value={values.username}
            placeholder="Họ và tên"
            onChange={val => handleChangeValue('username', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
            onEnd={() => formValidator('username')}
            error={errorMessage['username'] ? true : false}
          />
          {errorMessage['username'] && <TextComponent text={errorMessage['username']}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
          <InputComponent
            value={values.email}
            placeholder="abc@gmail.com"
            onChange={val => handleChangeValue('email', val)}
            allowClear
            affix={<Sms size={22} color={appColors.gray} />}
            onEnd={() => formValidator('email')}
            error={errorMessage['email'] ? true : false}
          />
          {errorMessage['email'] && <TextComponent text={errorMessage['email']}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
          <InputComponent
            value={values.password}
            placeholder="******"
            onChange={val => handleChangeValue('password', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('password')}
            error={errorMessage['password'] ? true : false}
          />
          {errorMessage['password'] && <TextComponent text={errorMessage['password']}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
          <InputComponent
            value={values.confirmPassword}
            placeholder="******"
            onChange={val => handleChangeValue('confirmPassword', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('confirmPassword')}
            error={errorMessage['confirmPassword'] ? true : false}
          />
          {errorMessage['confirmPassword'] && <TextComponent text={errorMessage['confirmPassword']}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
        </SectionComponent>
        {/* {ErrorMessage && (
          <SectionComponent>

          </SectionComponent>
        )} */}
        <SpaceComponent height={16} />
        <SectionComponent>
          <ButtonComponent
            onPress={handleRegister}
            text="SIGN UP"
            type="primary"
            disable={isDisable}
          />
        </SectionComponent>
        <SectionComponent>
          <RowComponent justify="center">
            <TextComponent text="Don't have an account? " />
            <ButtonComponent 
              type="link" 
              text="Sign In" 
              onPress={() => navigation.navigate('LoginScreen')} />
          </RowComponent>
        </SectionComponent>
      </ContainerComponent>
      <LoadingModal visible={isLoading} />
    </>
  )
}

export default RegisterScreen