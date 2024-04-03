import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { ErrorMessages } from '../../models/ErrorMessages';
import { Validator } from '../../utils/Validation';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/reducers/authReducers';
import authenticationAPI from '../../apis/authApi';
import { appColors } from '../../constants/appColors';
import { ArrowRight, Lock } from 'iconsax-react-native';
import { globalStyles } from '../../styles/globalStyles';
import { LoadingModal } from '../../modals';
import userAPI from '../../apis/userApi';

const initValue = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

const AccountScreen = () => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(initValue);
  const [errorRegister, setErrorRegister] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  
  const user = useSelector(authSelector);

  useEffect(() => {
    if (
      errorMessage.oldPassword || errorMessage.newPassword || errorMessage.confirmNewPassword || !values.oldPassword || !values.newPassword || !values.confirmNewPassword 
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
      const res = await userAPI.HandleUser('/password', {email: user.email, oldPassword: values.oldPassword, newPassword: values.newPassword}, 'post');
      setIsLoading(false);
      setValues(initValue);
      Alert.alert('Change Password successfully!!!');
      setIsDisable(true);
      setErrorRegister('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorRegister(error.message);
      } else {
        setErrorRegister("Network Error");
      }
      setIsLoading(false);
      setIsDisable(false);
    }
  };
  
  return (
    <>
      <ContainerComponent back isScroll>
        <SectionComponent>
          <TextComponent text="Change Password" title  size={24} color={appColors.primary} />
          <SpaceComponent height={21} />
          <InputComponent
              value={values.oldPassword}
              placeholder="Old Password"
              onChange={val => handleChangeValue('oldPassword', val)}
              allowClear
              isPassword
              affix={<Lock size={22} color={appColors.gray} />}
              onEnd={() => formValidator('oldPassword')}
              error={errorMessage['oldPassword']}
            />
          <InputComponent
              value={values.newPassword}
              placeholder="New Password"
              onChange={val => handleChangeValue('newPassword', val)}
              allowClear
              isPassword
              affix={<Lock size={22} color={appColors.gray} />}
              onEnd={() => formValidator('newPassword')}
              error={errorMessage['newPassword']}
            />
          <InputComponent
            value={values.confirmNewPassword}
            placeholder="Confirm New Password"
            onChange={val => handleChangeValue('confirmNewPassword', val)}
            allowClear
            isPassword
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('confirmNewPassword')}
            error={errorMessage['confirmNewPassword']}
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
            text="CHANGE PASSWORD"
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
      </ContainerComponent>
      <LoadingModal visible={isLoading} />
    </>
  )
}

export default AccountScreen