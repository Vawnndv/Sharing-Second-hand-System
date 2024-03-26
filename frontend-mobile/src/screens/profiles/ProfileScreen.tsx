import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { Button, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { ButtonComponent, ContainerComponent, HeaderComponent, RowComponent, SectionComponent, SpaceComponent } from '../../components'
import { removeAuth } from '../../redux/reducers/authReducers'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'

const ProfileScreen = () => {
  const dispatch = useDispatch();

  return (
    <ContainerComponent isScroll>
      <HeaderComponent />

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>ProfileScreen</Text>
        <SpaceComponent height={12} />
        <Button
          title="Logout"
          color={appColors.primary}
          onPress={async () => {
            await AsyncStorage.clear();
            dispatch(removeAuth({}));
          }}
        />
      </View>
    </ContainerComponent>
  )
}

export default ProfileScreen