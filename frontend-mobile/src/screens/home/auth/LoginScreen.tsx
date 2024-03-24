import { View, Text, Switch } from 'react-native'
import React, { useState } from 'react'
import { ButtonComponent, ContainerComponent, InputComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../../components'
import { Lock, Sms } from 'iconsax-react-native';
import { appColors } from '../../../constants/appColors';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(true);
  const [isDisable, setIsDisable] = useState(true);

  // const dispatch = useDispatch();

  return (
    <ContainerComponent isImageBackground isScroll>
      <SectionComponent 
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 75,
        }}
      >
        <TextComponent text="Sign In" title size={24} />
        <SpaceComponent height={21} />
        <InputComponent
          value={email}
          placeholder="Email"
          onChange={val => setEmail(val)}
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
        />
          <InputComponent
          value={password}
          placeholder="Password"
          onChange={val => setEmail(val)}
          isPassword
          allowClear
          affix={<Lock size={22} color={appColors.gray} />}
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
            onPress={() => {}}
            type="text"
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          disable={isDisable}
          onPress={() => {}}
          text="SIGN IN"
          type='primary'
        />
      </SectionComponent>
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Don't have an account? " />
          <ButtonComponent type="link" text='="Sign up' onPress={() => {}} />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default LoginScreen