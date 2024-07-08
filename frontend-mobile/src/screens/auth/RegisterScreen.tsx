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
  firstname: '',
  lastname: '',
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
      errorMessage.firstname ||
      errorMessage.lastname ||
      errorMessage.email || 
      errorMessage.password || 
      errorMessage.confirmPassword || 
      !values.firstname || 
      !values.lastname || 
      !values.email || 
      !values.password || 
      !values.confirmPassword 
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
      setIsLoading(false);
      navigation.navigate('VerificationScreen', {
        code: res.data.code,
        ...values,  
      })
      setIsDisable(true);
      setErrorRegister('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorRegister(error.message);
      } else {
        setErrorRegister("Lỗi mạng");
      }
      setIsLoading(false);
      setIsDisable(false);
    }
  };

  return (
    <>
      <ContainerComponent isScroll back>
        <SectionComponent>
          <TextComponent text="Đăng ký" title size={32} color={appColors.primary} styles={{textAlign: "center"}} />
          <SpaceComponent height={21} />
          <InputComponent
            value={values.lastname}
            placeholder="Họ"
            onChange={val => handleChangeValue('lastname', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
            onEnd={() => formValidator('lastname')}
            error={errorMessage['lastname']}
          />
          <InputComponent
            value={values.firstname}
            placeholder="Tên"
            onChange={val => handleChangeValue('firstname', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
            onEnd={() => formValidator('firstname')}
            error={errorMessage['firstname']}
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
            placeholder="Mật khẩu"
            onChange={val => handleChangeValue('password', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('password')}
            error={errorMessage['password']}
          />
          <InputComponent
            value={values.confirmPassword}
            placeholder="Xác nhận mật khẩu"
            onChange={val => handleChangeValue('confirmPassword', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('confirmPassword')}
            error={errorMessage['confirmPassword']}
          />
        </SectionComponent>
        {errorRegister && (
          <SectionComponent>
              <TextComponent text={errorRegister} color={appColors.danger} />
          </SectionComponent>
        )}
        <SpaceComponent height={16} />
        <SectionComponent>
          <ButtonComponent
            onPress={handleRegister}
            text="ĐĂNG KÝ"
            type="primary"
            iconFlex="right"
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
            <TextComponent text="Bạn đã có mật khẩu? " />
            <ButtonComponent 
              type="link" 
              text="Đăng nhập" 
              onPress={() => navigation.navigate('LoginScreen')} />
          </RowComponent>
        </SectionComponent>
      </ContainerComponent>
      <LoadingModal visible={isLoading} />
    </>
  )
}

export default RegisterScreen