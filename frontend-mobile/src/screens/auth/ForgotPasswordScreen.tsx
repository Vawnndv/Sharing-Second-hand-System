import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { ArrowRight, Sms } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { LoadingModal } from '../../modals';
import authenticationAPI from '../../apis/authApi';
import { globalStyles } from '../../styles/globalStyles';
import { Validator } from '../../utils/Validation';
import { ErrorMessages } from '../../models/ErrorMessages';

const initValue = {
  email: '',
};

const ForgotPasswordScreen = () => {
  const [values, setValues] = useState(initValue);
  const[isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(initValue);
  const [errorForgotPassword, setErrorForgotPassword] = useState('');

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;
    
    setValues(data);
  };

  useEffect(() => {
    const emailValidation = Validator.email(values.email);

    if (!values.email || !emailValidation || errorMessage.email) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [values, errorMessage]);
  
  const formValidator = (key: keyof ErrorMessages) => { 
    setErrorMessage(Validator.Validation(key, errorMessage, values));

  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      const res: any = await authenticationAPI.HandleAuthentication('/forgotPassword', {email: values.email}, 'post');

      Alert.alert('Gửi email', 'Chúng tôi đã gửi một email bao gồm mật khẩu mới');
      setIsLoading(false);
      setIsDisable(true);
      setErrorForgotPassword('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorForgotPassword(error.message);
      } else {
        setErrorForgotPassword("Network Error");
      }
      setIsLoading(false);
      setIsDisable(false);
    }
  };

  return (
    <ContainerComponent
      back
      isScroll
    >
      <SectionComponent>
        <TextComponent text="Đặt lại mật khẩu" title  size={32} color={appColors.primary} styles={{textAlign: "center"}} />
        <SpaceComponent height={21} />
        <TextComponent text="Vui lòng nhập địa chỉ email của bạn để yêu cầu đặt lại mật khẩu" />
        <SpaceComponent height={16} />
        <InputComponent
          value={values.email}
          onChange={val => handleChangeValue('email', val)}
          affix={<Sms size={20} color={appColors.gray}/> }
          placeholder="abc@gmail.com"
          allowClear
          onEnd={() => formValidator('email')}
          error={errorMessage['email']}
        />
      </SectionComponent>
      {errorForgotPassword ? (
        <SectionComponent>
          <TextComponent text={errorForgotPassword} color={appColors.danger} />
        </SectionComponent>
      ) : (
        <SpaceComponent height={16} />
      )}
      <SectionComponent>
        <ButtonComponent
          onPress={handleForgotPassword}
          disable={isDisable}
          text="Gửi"
          type="primary"
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
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  )
}

export default ForgotPasswordScreen