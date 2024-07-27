import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ChartSquare, Home, User } from "iconsax-react-native";
import { ReactNode } from "react";
import { Platform } from "react-native";
import { appColors } from "../../constants/appColors";
import HomeNavigator from "./HomeNavigator";
import ProfileNavigator from "./ProfileNavigator";
import StatisticNavigator from "./statisticNavigator";
import React from "react";

const MainTabNavigator = () => {
    
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
                paddingBottom: 6
                },
                tabBarIcon: ({focused, color, size}) => {
                let icon: ReactNode;
                color = focused ? appColors.primary : appColors.gray5;
                size = 28;
                const variant = focused ? 'Bold' : 'Outline';
                
                switch (route.name) {
                    case 'Trang chủ':
                        icon = <Home size={size} color={color} variant={variant} />
                        break;
                    case 'Thống kê':
                        icon = <ChartSquare size={size} color={color} variant={variant} />
                        break;
                    case 'Thông tin':
                        icon = <User size={size} color={color} variant={variant} />
                        break;
                }
                return icon;
                },
                tabBarIconStyle: {
                marginTop: 8,
                },
            })}
        >
            
                <Tab.Screen name="Trang chủ" component={HomeNavigator} />
                <Tab.Screen name="Thống kê" component={StatisticNavigator} />
                <Tab.Screen name="Thông tin" component={ProfileNavigator} />
            
            
        </Tab.Navigator>
        
    )
}

export default MainTabNavigator