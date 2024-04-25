import { View, Text } from 'react-native'
import React from 'react'
import { ContainerComponent, HeaderComponent, SectionComponent, TextComponent } from '../../components'
import ItemTabComponent from './components/ItemTabComponent'

const NotificationScreen = () => {
  return (
    <ContainerComponent right back title='Thông báo'>
      <ItemTabComponent />
    </ContainerComponent>
  )
}

export default NotificationScreen