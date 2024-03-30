import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { ArrowRight, Lock, Sms, User } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { LoadingModal } from '../../modals';
import authenticationAPI from '../../apis/authApi';
import {  Validator } from '../../utils/Validation';
import { globalStyles } from '../../styles/globalStyles';
import { ErrorMessages } from '../../models/ErrorMessages';



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
  const [errorRegister, setErrorRegister] = useState('');
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

  const formValidator = (key: keyof ErrorMessages) => {
    setErrorMessage(Validator.Validation(key, errorMessage, values));
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
      Alert.alert('email is exist in system!!!');
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
            error={errorMessage['username']}
          />
          <InputComponent
            value={values.email}
            placeholder="abc@gmail.com"
            onChange={val => handleChangeValue('email', val)}
            allowClear
            affix={<Sms size={22} color={appColors.gray} />}
            onEnd={() => formValidator('email')}
            error={errorMessage['email']}
          />
          
          <InputComponent
            value={values.password}
            placeholder="Password"
            onChange={val => handleChangeValue('password', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('password')}
            error={errorMessage['password']}
          />
          <InputComponent
            value={values.confirmPassword}
            placeholder="Confirm password"
            onChange={val => handleChangeValue('confirmPassword', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('confirmPassword')}
            error={errorMessage['confirmPassword']}
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