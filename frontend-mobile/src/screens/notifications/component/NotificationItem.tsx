import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import React, { useRef } from 'react'
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '../../../components';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { appColors } from '../../../constants/appColors';
import moment from 'moment';
import { Clock } from 'iconsax-react-native';
import { fontFamilies } from '../../../constants/fontFamilies';
import { globalStyles } from '../../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { NotificationModel } from '../../../models/NotificationModel';
import * as Linking from 'expo-linking';
import 'moment/locale/vi';

type UserItemPros = {
    item: NotificationModel;
    index: number;
    onDeletePressed: (id: string) => void;
    updateRead: (id: string) => void;
};

const NotificationItem = ({ item, index, onDeletePressed, updateRead }: UserItemPros) => {
  const navigation: any = useNavigation();
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (progress: any, dragX: any) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [-10, 50],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={[styles.swipeContainer, {backgroundColor: item.isRead ? '#ffffff' : '#d0e3ff'}]}>
        <Animated.View style={[styles.swipeBtn, {opacity, transform: [{ translateX: trans }]}]}>
          <TouchableOpacity
            onPress={() => {
              swipeableRef.current?.close();
              onDeletePressed(item.id);
            }}
          >
            <FontAwesome name="trash" size={24} color={appColors.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        key={`swipe-${item.createdAt}-${index}`}
        overshootRight={false} // Disable overshoot effect
        friction={1} // Lower friction to increase swipe speed and sensitivity
        rightThreshold={20} // Decrease threshold for easier and faster swipe completion
        containerStyle={{ borderBottomWidth: 0.6 }}
      >
        <RowComponent
          key={`event${index}`}
          onPress={() => {
            // Linking.openURL(`frontend-mobile://profile`);
              // Linking.openURL(`frontend-mobile://order/detail/${136}`)
              // Linking.openURL(`frontend-mobile://main/home/post/detail/${item.postid}`);
              if (item.link) {
                Linking.openURL(`frontend-mobile://${item.link}`)
                // const parts = item.link.split('/');
                // if( parts[0] === 'order') {
                //   navigation.navigate('MyOrder', {
                //     screen: 'ViewDetailOrder',
                //     params: {
                //       orderid: parts[1]
                //     },
                //   });
                // } else {
                //   navigation.navigate('Home', {
                //     screen: 'ItemDetailScreen',
                //     params: {
                //       postID: parts[1]
                //     },
                //   });
                // }
            }
            updateRead(item.id);
          }}
          styles={{ padding: 12, backgroundColor: item.isRead ? '#ffffff' : '#d0e3ff' }}
        >
          <AvatarComponent
            username={item.name}
            avatar={item.avatar}
            size={70}
          />
          <SpaceComponent width={12} />
          <View style={[globalStyles.col]}>
            <RowComponent>
              <TextComponent text={`${item.name} `} font={fontFamilies.medium} text2={item.body} isConcat />
            </RowComponent>
            <RowComponent justify='space-between'>
              <RowComponent>
                <Clock size={14} color={appColors.black} />
                <SpaceComponent width={4} />
                <TextComponent text={moment(item.createdAt.seconds * 1000 + item.createdAt.nanoseconds / 1000000).fromNow()} font={fontFamilies.light} />
              </RowComponent>
            </RowComponent>
          </View>
        </RowComponent>
      </Swipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  swipeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
    width: 80,
    // borderBottomWidth: 1,
  },

  swipeBtn: {
    backgroundColor: 'red',
    margin: 8,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  }
})

export default NotificationItem
