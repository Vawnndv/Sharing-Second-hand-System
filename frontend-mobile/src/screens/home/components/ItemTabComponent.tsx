import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserPostComponent from './UserPostComponent';
import WarehouseComponent from './WarehouseComponent';
import { RowComponent, SectionComponent, TextComponent } from '../../../components';
import { appColors } from '../../../constants/appColors';
import { fontFamilies } from '../../../constants/fontFamilies';
import FilterOrder from '../../../components/OrderManagement/FilterOrder';
import userAPI from '../../../apis/userApi';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../redux/reducers/authReducers';
import postsAPI from '../../../apis/postApi';

interface Posts {
  avatar: string;
  username: string;
  firstname: string; 
  lastname: string; 
  description: string; 
  updatedat: string; 
  createdat: string;
  postid: string;
  location: string;
  path: string;
};

const ItemTabComponent = () => {
  const SubTabs = createMaterialTopTabNavigator();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [filterValue, setFilterValue] = useState({
    distance: -1,
    time: -1,
    category: "Tất cả",
    sort: "Mới nhất"
  })

  useEffect(() => {

  }, [])

  return (
    <SubTabs.Navigator
      style={styles.tabs}
      tabBar={({ state, descriptors, navigation }) => (
        <View style={styles.tabBar}>
          <RowComponent>
          {/* Render các tab */}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            return (
                <SectionComponent 
                  key={index}
                  styles={{
                    paddingBottom: 4,
                  }}
                >
                  <Text
                    onPress={() => {
                      setFocusedIndex(index);
                      navigation.navigate(route.name);
                    }}
                    style={[
                      styles.tabLabel,
                      { color: index === state.index ? appColors.primary : '#666', marginBottom: index === state.index ? 4 : 7 },
                    ]}
                  >
                    {typeof label === 'function' ? label({ focused: index === state.index, color: appColors.primary, children: '' }) : label}
                  </Text>
                  {focusedIndex === index && <View style={styles.tabIndicator} />}
                </SectionComponent>
            );
          })}
          </RowComponent>
          {/* FilterComponent nằm trong tabBar */}
          <FilterOrder filterValue={filterValue} setFilterValue={setFilterValue}/>
        </View>
      )}
    >
      <SubTabs.Screen
        name="Nguời Cho"
        component={UserPostComponent}
        initialParams={{ filterValue }}
      />
      <SubTabs.Screen
        name="Lưu kho"
        component={WarehouseComponent}
        initialParams={{ filterValue }}
      />
    </SubTabs.Navigator>
  );

  // return (
  //   <SubTabs.Navigator style={styles.tabs}>
  //     <SubTabs.Screen
  //       name="Bài đăng"
  //       component={UserPostComponent}
  //       options={{
  //         tabBarLabel: 'Bài đăng',
  //         tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
  //         tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
  //         tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
  //       }}
  //     />
  //     <SubTabs.Screen
  //       name="Lưu kho"
  //       component={WarehouseComponent}
  //       options={{
  //         tabBarLabel: 'Lưu kho',
  //         tabBarStyle: styles.tabItem, // Áp dụng style cho tab này
  //         tabBarLabelStyle: styles.tabLabel, // Áp dụng style cho chữ
  //         tabBarIndicatorStyle: styles.tabIndicator, // Áp dụng style cho đấu gạch dưới
  //       }}
  //     />
  //   </SubTabs.Navigator>
  // );
}

export default ItemTabComponent;
  
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent', // Để phù hợp với màu nền của FilterComponent
  },
  tabs: {
    flexDirection: 'column',
    backgroundColor: '#fff'
  },

  tabItem: {
    width: '60%',
    backgroundColor: 'transparent',
  },

  tabLabel: {
    textTransform: 'capitalize',
    color: appColors.primary,
    fontSize: 17,
    fontFamily: fontFamilies.bold,
  },

  tabIndicator: {
    backgroundColor: appColors.primary,
    height: 3,
  },
});