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
import LoadingComponent from './LoadingComponent';

interface Props {
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean; 
  right?: boolean;
  badge?: number;
  option?: ReactNode;
  isLoading?: boolean;
};

const ContainerComponent = (props: Props) => {
  const {children, isScroll, title, back, right, badge, option, isLoading} = props;
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
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <LoadingComponent isLoading={isLoading} />
      ) : (
        <ScrollView 
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </View>
  ) : (
    <>
      {isLoading ? (
        <View style={{flex: 1}}>
          <LoadingComponent isLoading={isLoading} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          {children}
        </View>
      )}
    </>
  );

  return (
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