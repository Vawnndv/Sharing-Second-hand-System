import { View, Text, StatusBar, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { ContainerComponent, RowComponent, SectionComponent } from '../../components'
import { globalStyles } from '../../styles/globalStyles'
import { appColors } from '../../constants/appColors'
import { HambergerMenu, Location, nLocation } from 'iconsax-react-native'

const HomeScreen = ({navigation}: any) => {
  return (
    <ContainerComponent isImageBackground isScroll>
      <SectionComponent styles={{marginTop: 25,}}>
        <RowComponent justify='space-between'>
          <Text>Hello</Text>
          <RowComponent>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <HambergerMenu size={24} color={appColors.gray} />
            </TouchableOpacity>
          </RowComponent>
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  )
}

export default HomeScreen