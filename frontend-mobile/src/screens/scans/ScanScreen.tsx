import React from 'react'
import { Text } from 'react-native'
import { ContainerComponent, HeaderComponent, SectionComponent } from '../../components'

const ScanScreen = () => {
  return (
  <ContainerComponent isScroll>
    <HeaderComponent />
      <SectionComponent>
        <Text>ScanScreen</Text>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default ScanScreen