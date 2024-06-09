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
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


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
            case 'Trang chủ':
              icon = <Home size={size} color={color} variant={variant} />
              break;
            case 'Quét mã':
              icon = <Scan size={size} color={color} variant={variant} />
              break;
            case 'Thêm':
              icon = <CircleComponent size={52} styles={{
                      marginTop: Platform.OS === 'ios' ? -50 : -60
                    }}>
                      <AddSquare size={24} color={appColors.white} variant="Bold" />
                    </CircleComponent>
              break;
            case 'Tin nhắn':
              icon = <Message size={size} fill={color} color={color} variant={variant} />
              break;
            case 'Thông tin':
              icon = <User size={size} color={color} variant={variant} />
              break;
          }
          return icon;
        },
        tabBarIconStyle: {
          marginTop: 8
        },
        tabBarLabel ({focused}) {
          return route.name === 'Thêm' ? null : (
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
      <Tab.Screen 
        name="Trang chủ" 
        component={HomeNavigator}  
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "HomeScreen"
            if (routeName !== 'HomeScreen') {
              return { display: "none" }
            }
            return {
              height: Platform.OS === 'ios' ? 88 : 68,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: appColors.white,
            }
          })(route),
        })} 
      />
      <Tab.Screen name="Quét mã" component={ScanNavigator} />
      <Tab.Screen name="Thêm" component={AddNavigator} />
      <Tab.Screen 
        name="Tin nhắn" 
        component={ChatNavigator}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "ChatScreen"
            if (routeName !== 'ChatScreen') {
              return { display: "none" }
            }
            return {
              height: Platform.OS === 'ios' ? 88 : 68,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: appColors.white,
            }
          })(route),
        })} 
      />

      <Tab.Screen 
        name="Thông tin" 
        component={ProfileNavigator} 
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "ProfileScreen"
            if (routeName !== 'ProfileScreen') {
              return { display: "none" }
            }
            return {
              height: Platform.OS === 'ios' ? 88 : 68,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: appColors.white,
            }
          })(route),
        })} 
      />  
    </Tab.Navigator>
  )
}

export default TabNavigator