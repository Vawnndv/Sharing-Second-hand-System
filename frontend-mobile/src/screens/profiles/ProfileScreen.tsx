import React from 'react'
import { Button, Text } from 'react-native'
import { ContainerComponent, HeaderComponent, SectionComponent } from '../../components'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { removeAuth } from '../../redux/reducers/authReducers'
import { useDispatch } from 'react-redux'

const ProfileScreen = () => {
  const dispatch = useDispatch();

  return (
    <ContainerComponent isScroll>
      <HeaderComponent />
      <SectionComponent>
        <Text>ProfileScreen</Text>
        <Button
        title="Logout"
        onPress={async () => {
          await AsyncStorage.clear();
          dispatch(removeAuth({}));
        }}
      />
      </SectionComponent>
    </ContainerComponent>
  )
}

export default ProfileScreen