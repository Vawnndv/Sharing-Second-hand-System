import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TextComponent } from '../../components';
import { fontFamilies } from '../../constants/fontFamilies';

const ChatItem = ({item, route, navigation, noBorder}: any) => {
  const openChatRoom = ()=> {
    navigation.navigate('ChatRoomScreen', {
      item: item,
    });
  }

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 20,
        marginHorizontal: 20,
        marginBottom: 4,
        paddingBottom: 2,
        borderBottomWidth: noBorder ? 0 : 0.5
      }}
      onPress={openChatRoom}
    >
      <Image
        source={{uri: item?.avatar}}
        style={{height: hp(9), width: hp(9), borderRadius: 100}}
      />

      {/* Name and last message */}
      <View style={{flex: 1, gap: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: hp(2), fontFamily: fontFamilies.bold}}>{item?.firstname} {item?.lastname}</Text>
          <Text style={{fontSize: hp(1.8), fontFamily: fontFamilies.medium, opacity: 0.5}}>Time</Text>
        </View>
        <Text style={{fontSize: hp(1.8), fontFamily: fontFamilies.medium, opacity: 0.5}}>Last message</Text>
      </View>

    </TouchableOpacity>
  )
}

export default ChatItem

const styles = StyleSheet.create({})