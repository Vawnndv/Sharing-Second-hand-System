import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import SectionComponent from './SectionComponent'
import RowComponent from './RowComponent'
import { HambergerMenu } from 'iconsax-react-native'
import { appColors } from '../constants/appColors'
import { useNavigation } from '@react-navigation/native';

const HeaderComponent = () => {
  const navigation: any = useNavigation();

  return (
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
  )
}

export default HeaderComponent