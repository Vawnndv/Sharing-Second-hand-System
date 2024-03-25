import React from 'react'
import { Text } from 'react-native'
import { ContainerComponent, HeaderComponent, SectionComponent } from '../../components'

const ProfileScreen = () => {
  return (
    <ContainerComponent isScroll>
      <HeaderComponent />
      <SectionComponent>
        <Text>ProfileScreen</Text>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default ProfileScreen