import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Validate } from '../../utils/Validation';
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { ArrowRight, Sms } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { LoadingModal } from '../../modals';
import authenticationAPI from '../../apis/authApi';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const[isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // const handleCheckEmail = () => {
  //   const isValidEmail = Validate.email(email);
  //   setIsDisable(!isValidEmail);
  // };

  useEffect(() => {
    const emailValidation = Validate.email(email);

    if (!email || !emailValidation || errorMessage) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [email, errorMessage]);
  
  const formValidator = () => {
    let message = '';
      if (!email) {
        message = 'Email is required';
      } else if (!Validate.email(email)) {
        message = 'Email is not invalid';
      } else {
        message = '';
      }
  
    setErrorMessage(message); 
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      const res: any = await authenticationAPI.HandleAuthentication('/forgotPassword', {email}, 'post');

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
          value={email}
          onChange={val => setEmail(val)}
          affix={<Sms size={20} color={appColors.gray}/> }
          placeholder="abc@gmail.com"
          allowClear
          // onEnd={handleCheckEmail}
          onEnd={formValidator}
          error={errorMessage ? true : false}
        />
        {errorMessage && <TextComponent text={errorMessage}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleForgotPassword}
          disable={isDisable}
          text="Send"
          type="primary"
          icon={<ArrowRight size={20} color={appColors.white} />}
          iconFlex="right"
        />
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  )
}

export default ForgotPasswordScreen