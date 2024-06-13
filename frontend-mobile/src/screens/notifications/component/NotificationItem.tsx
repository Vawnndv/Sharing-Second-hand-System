import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
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
    return (
      <TouchableOpacity
        onPress={() => {
          swipeableRef.current?.close();
          onDeletePressed(item.id);
        }}
      >
        <View style={[styles.swipeContainer, {backgroundColor: item.isRead ? '#ffffff' : '#A2C3F6'}]}>
          <View style={styles.swipeBtn}>
            <FontAwesome name="trash" size={24} color={appColors.white} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        key={`swipe-${item.createdAt}-${index}`}
        leftThreshold={10}
      >
        <RowComponent
          key={`event${index}`}
          onPress={() => {
            if (item.link) {
              navigation.navigate('Home', {
                screen: item.link,
                params: {
                  postID: item.postid
                },
              });
            }
            updateRead(item.id);
          }}
          styles={{ padding: 12, backgroundColor: item.isRead ? '#ffffff' : '#A2C3F6', borderBottomWidth: 1}}
        >
          <AvatarComponent
            username={item.name}
            size={78}
          />
          <SpaceComponent width={12} />
          <View style={[globalStyles.col]}>
            <RowComponent>
              <TextComponent text={`${item.name} `} font={fontFamilies.medium} text2={item.text} isConcat />
            </RowComponent>
            <RowComponent justify='space-between'>
              <RowComponent>
                <Clock size={14} color={appColors.black} />
                <SpaceComponent width={4} />
                <TextComponent text={moment(item.createdAt.seconds * 1000 + item.createdAt.nanoseconds / 1000000).fromNow()} font={fontFamilies.light} />
              </RowComponent>
              <RowComponent>
                <MaterialIcons name="more-horiz" color={appColors.black} variant='Bold' size={24} />
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
    flex: 1,
    borderBottomWidth: 1,
  },

  swipeBtn: {
    backgroundColor: 'red',
    margin: 8,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  }
})

export default NotificationItem
