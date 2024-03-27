import { View, Text } from 'react-native'
import React from 'react'
import { ContainerComponent, HeaderComponent, SectionComponent } from '../../components'

const NotificationScreen = () => {
  return (
    <ContainerComponent isScroll title='Notification Screen' right back>
      <SectionComponent>
        <Text>ScanScreen</Text>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default NotificationScreen