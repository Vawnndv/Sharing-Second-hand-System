import React from 'react'
import { Text } from 'react-native'
import { ContainerComponent, HeaderComponent, SectionComponent } from '../../components'

const MessageScreen = () => {
  return (
    <ContainerComponent isScroll title='Message Screen' right>
      <SectionComponent>
        <Text>MessageScreen</Text>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default MessageScreen