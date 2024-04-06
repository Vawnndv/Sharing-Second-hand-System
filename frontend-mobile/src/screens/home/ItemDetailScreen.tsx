import { View, Text } from 'react-native'
import React from 'react'
import { ContainerComponent, SectionComponent } from '../../components'

const ItemDetailScreen = () => {
  return (
    <ContainerComponent isScroll title='Notification Screen' right back>
      <SectionComponent>
        <Text>ScanScreen</Text>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default ItemDetailScreen