import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AddSquare, Home, Message, Scan, User } from 'iconsax-react-native';
import React, { ReactNode } from 'react';
import { Platform } from 'react-native';
import { CircleComponent, TextComponent } from '../components';
import { appColors } from '../constants/appColors';
import AddNavigator from './AddNavigator';
import HomeNavigator from './HomeNavigator';
import MessagesNavigator from './MessagesNavigator';
import ProfileNavigator from './ProfileNavigator';
import ScanNavigator from './ScanNavigator';
import ChatNavigator from './ChatNavigator';

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
  variant: string; // Thêm thuộc tính 'variant' vào kiểu dữ liệu
}
const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator 
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: appColors.white,
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused, color, size}) => {
          let icon: ReactNode;
          color = focused ? appColors.primary : appColors.gray5;
          size = 24;
          const variant = focused ? 'Bold' : 'Outline';
          
          switch (route.name) {
            case 'Home':
              icon = <Home size={size} color={color} variant={variant} />
              break;
            case 'Scan':
              icon = <Scan size={size} color={color} variant={variant} />
              break;
            case 'Add':
              icon = <CircleComponent size={52} styles={{
                      marginTop: Platform.OS === 'ios' ? -50 : -60
                    }}>
                      <AddSquare size={24} color={appColors.white} variant="Bold" />
                    </CircleComponent>
              break;
            case 'Message':
              icon = <Message size={size} fill={color} color={color} variant={variant} />
              break;
            case 'Profile':
              icon = <User size={size} color={color} variant={variant} />
              break;
          }
          return icon;
        },
        tabBarIconStyle: {
          marginTop: 8
        },
        tabBarLabel ({focused}) {
          return route.name === 'Add' ? null : (
            <TextComponent
              text={route.name}
              flex={0}
              size={12}
              color={focused ? appColors.primary : appColors.gray5}
              styles={{
                marginBottom: Platform.OS === 'android' ? 12 : 0,
              }}
            />
          );
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Scan" component={ScanNavigator} />
      <Tab.Screen name="Add" component={AddNavigator} />
      <Tab.Screen name="Message" component={ChatNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  )
}

export default TabNavigator