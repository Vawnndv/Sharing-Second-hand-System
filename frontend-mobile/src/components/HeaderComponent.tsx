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
    <RowComponent justify='flex-end'>
      <RowComponent>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <HambergerMenu size={24} color={appColors.gray} />
        </TouchableOpacity>
      </RowComponent>
    </RowComponent>
  )
}

export default HeaderComponent