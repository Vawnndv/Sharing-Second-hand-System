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

      console.log(res);
      Alert.alert('Send mail', 'We sended a email includes new password!!!');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(`Can not create new password api forgot password, ${error}`);
    }
  };

  return (
    <ContainerComponent
      back
      isImageBackground
      isScroll
    >
      <SectionComponent>
        <TextComponent text="Reset Password" title  size={24} color={appColors.primary} />
        <SpaceComponent height={12} />
        <TextComponent text="Please enter your email address to request a password reset" />
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
      <SectionComponent>
        <ButtonComponent
          onPress={handleForgotPassword}
          disable={isDisable}
          text="Send"
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