import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { Lock, Sms, User } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { LoadingModal } from '../../modals';
import authenticationAPI from '../../apis/authApi';
import { Validate } from '../../utils/Validation';

const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const RegisterScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if (!errorMessage 
      || errorMessage 
        && (errorMessage.email 
          || errorMessage.password 
          || errorMessage.confirmPassword) 
      || !values.email 
      || !values.password 
      || !values.confirmPassword
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
    const data = {...errorMessage};
    let message = '';

    switch (key) {
      case 'email':
        if (!values.email) {
          message = 'Email is required';
        } else if (!Validate.email(values.email)) {
          message = 'Email is not invalid';
        } else {
          message = '';
        }
        break;
      
        case 'password':
        message = !values.password ? 'Password is required!!!' : '';
        break;

        case 'confirmPassword':
          if (!values.confirmPassword) {
            message = 'Please type confirm password';
          } else if (values.confirmPassword !== values.password) {
            message = 'Password is not match';
          } else {
            message = '';
          }
          break;
    }

    data[`${key}`] = message;

    setErrorMessage(data);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication('/verification', {email: values.email}, 'post');

      setIsLoading(false);
      navigation.navigate('VerificationScreen', {
        code: res.data.code,
        ...values,  
      })
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContainerComponent isImageBackground isScroll back>
        <SectionComponent>
          <TextComponent text="Sign Up" title size={24} />
          <SpaceComponent height={21} />
          <InputComponent
            value={values.username}
            placeholder="Họ và tên"
            onChange={val => handleChangeValue('username', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
          />
          <InputComponent
            value={values.email}
            placeholder="abc@gmail.com"
            onChange={val => handleChangeValue('email', val)}
            allowClear
            affix={<Sms size={22} color={appColors.gray} />}
            onEnd={() => formValidator('email')}
          />
          <InputComponent
            value={values.password}
            placeholder="******"
            onChange={val => handleChangeValue('password', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('password')}

          />
          <InputComponent
            value={values.confirmPassword}
            placeholder="******"
            onChange={val => handleChangeValue('confirmPassword', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('confirmPassword')}
          />
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
            <TextComponent text="Don't have an account?" />
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