import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../../components';
import { Lock, Sms, User } from 'iconsax-react-native';
import { appColors } from '../../../constants/appColors';
import { LoadingModal } from '../../../modals';

const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const RegisterScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState<any>();
  const [isDisable, setIsDisable] = useState(true);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;
    
    setValues(data);
  };

  const handleRegister = async () => {

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
            onEnd={() => {}}
          />
          <InputComponent
            value={values.email}
            placeholder="abc@gmail.com"
            onChange={val => handleChangeValue('email', val)}
            allowClear
            affix={<Sms size={22} color={appColors.gray} />}
            onEnd={() => {}}
          />
          <InputComponent
            value={values.password}
            placeholder="******"
            onChange={val => handleChangeValue('email', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => {}}
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