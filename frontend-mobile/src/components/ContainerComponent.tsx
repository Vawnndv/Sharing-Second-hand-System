import { View, Text, ImageBackground, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { ReactNode } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { appColors } from '../constants/appColors';
import TextComponent from './TextComponent';
import { fontFamilies } from '../constants/fontFamilies';
import RowComponent from './RowComponent';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean; 
};

const ContainerComponent = (props: Props) => {
  const {children, isScroll, isImageBackground, title, back} = props;

  const navigation: any = useNavigation();

  const headerComponent = () => {
    return (
      <View 
        style={{
          flex:1,
          paddingTop: 30,
        }}
      >
        {(title || back) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'flex-start'
            }}
          >
            {back && (
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={{
                  marginRight: 12,
                }}
              >
                <AntDesign name="arrowleft" size={24} color={appColors.text} />
              </TouchableOpacity>
            )}
            {title ? (
                <TextComponent 
                  text={title} 
                  font={fontFamilies.medium} 
                  size={16} 
                  flex={1} 
                />
            ) : (
              <></>
            )}
          </RowComponent>
        )}
        {returnContainer}
      </View>
    )
  };

  const returnContainer = isScroll ? (
    <ScrollView 
      style={{flex: 1}}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{flex: 1}}>
      {children}
    </View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={require('../../assets/images/splash-img.png')}
      style={{flex: 1}}
      imageStyle={{flex: 1}}
    >
      <SafeAreaView style={{flex: 1}}>
        {headerComponent()}
      </SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <View>
        {returnContainer}
      </View>
    </SafeAreaView>
  )
}

export default ContainerComponent