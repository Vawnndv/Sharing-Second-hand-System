import { View, Text, ImageBackground, SafeAreaView, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native'
import React, { ReactNode } from 'react'
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { appColors } from '../constants/appColors';
import TextComponent from './TextComponent';
import { fontFamilies } from '../constants/fontFamilies';
import RowComponent from './RowComponent';
import {globalStyles} from '../styles/globalStyles';
import HeaderComponent from './HeaderComponent';
import { Badge } from 'react-native-elements';
import AvatarComponent from './AvatarComponent';
import SpaceComponent from './SpaceComponent';

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean; 
  right?: boolean;
  badge?: number;
  option?: ReactNode;
};

const ContainerComponent = (props: Props) => {
  const {children, isScroll, isImageBackground, title, back, right, badge, option} = props;
  const navigation: any = useNavigation();

  const headerComponent = () => {
    return (
      <View 
        style={{
          flex:1,
          paddingTop: 1,
        }}
      >
        {(title || back || right) ? (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'flex-start',
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
            {title && (
              <RowComponent styles={{flex: 1}}>
                <TextComponent 
                  text={title} 
                  font={fontFamilies.medium} 
                  size={20} 
                />
                {badge !== null && badge !==undefined && badge > 0 && (
                  <>
                    <SpaceComponent width={6} />
                    <AvatarComponent
                      username={badge.toString()}
                      size={26}
                      isNumber={true} 
                    />
                  </>
                )}
              </RowComponent>
            )}
            {right && (
              <HeaderComponent />
            )}
            {option && option}
          </RowComponent>
        ) : (
          <RowComponent>

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
      style={{flex: 1, paddingTop: 30}}
      imageStyle={{flex: 1}}
    >
      <SafeAreaView style={{flex: 1}}>
        {headerComponent()}
      </SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <View
        style={[
          globalStyles.container,
          {paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0},
        ]}>
        {headerComponent()}
      </View>
    </SafeAreaView>
  )
}

export default ContainerComponent