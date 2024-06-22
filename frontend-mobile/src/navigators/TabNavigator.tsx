import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AddSquare, Home, Message, Scan, User } from 'iconsax-react-native';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { CircleComponent, TextComponent } from '../components';
import { appColors } from '../constants/appColors';
import AddNavigator from './AddNavigator';
import HomeNavigator from './HomeNavigator';
import MessagesNavigator from './MessagesNavigator';
import ProfileNavigator from './ProfileNavigator';
import ScanNavigator from './ScanNavigator';
import ChatNavigator from './ChatNavigator';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Badge } from 'react-native-elements';
import { collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/reducers/authReducers';
import { processRooms } from '../utils/messageUtils';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const auth = useSelector(authSelector);

  useEffect(() => {
    console.log('Rooms collection changed');
    processRooms(auth.id, setUnreadMessagesCount);
  }, [auth.id]);

  const setUnreadCount = useCallback((count: any) => {
    setUnreadMessagesCount(count);
  }, []);

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
          color = focused ? appColors.primary : appColors.gray4;
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
              icon = (
                <View>
                  <Message size={size} fill={color} color={color} variant={variant} />
                  {unreadMessagesCount > 0 && (
                    <Badge
                      value={unreadMessagesCount}
                      status="error"
                      containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                    />
                  )}
                </View>
              );
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
          let text;
          switch (route.name) {
            case 'Home':
              text = 'Trang chủ';
              break;
            case 'Scan':
              text = 'Quét mã';
              break;
            case 'Message':
              text = 'Tin nhắn';
              break;
            case 'Profile':
              text = 'Thông tin';
              break;
            default:
              text = route.name;
              break;
          }

          return route.name === 'Add' ? null : (
            <TextComponent
              text={text}
              flex={0}
              size={12}
              color={focused ? appColors.primary : appColors.gray4}
              styles={{
                marginBottom: Platform.OS === 'android' ? 12 : 0,
              }}
            />
          );
        }
      })}
    >
      <Tab.Screen 
        name="Home" 
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
      <Tab.Screen name="Scan" component={ScanNavigator} />
      <Tab.Screen name="Add" component={AddNavigator} />
      <Tab.Screen 
        name="Message" 
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "ChatScreen";
            if (routeName !== 'ChatScreen') {
              return { display: "none" };
            }
            return {
              height: Platform.OS === 'ios' ? 88 : 68,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: appColors.white,
            };
          })(route),
        })}
      >
        {props => <ChatNavigator {...props} setUnreadCount={setUnreadCount} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Profile" 
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
  );
}

export default TabNavigator;
