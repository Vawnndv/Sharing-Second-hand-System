import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeNavigator from "./HomeNavigator";
import StatisticNavigator from "./statisticNavigator";
import ProfileNavigator from "./ProfileNavigator";
import { Platform, TextComponent } from "react-native";
import { appColors } from "../../constants/appColors";
import { ReactNode } from "react";
import { AddSquare, Home, Message, Scan, User, ChartSquare } from "iconsax-react-native";
import { CircleComponent } from "../../components";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
                },
                tabBarIcon: ({focused, color, size}) => {
                let icon: ReactNode;
                color = focused ? appColors.primary : appColors.gray5;
                size = 24;
                const variant = focused ? 'Bold' : 'Outline';
                
                switch (route.name) {
                    case 'Home':
                        icon = <Home size={size} color={color} variant={variant} />
                        break;
                    case 'Statistic':
                        icon = <ChartSquare size={size} color={color} variant={variant} />
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
            })}
        >
            
                <Tab.Screen name="Home" component={HomeNavigator} />
                <Tab.Screen name="Statistic" component={StatisticNavigator} />
                <Tab.Screen name="Profile" component={ProfileNavigator} />
            
            
        </Tab.Navigator>
        
    )
}

export default MainTabNavigator