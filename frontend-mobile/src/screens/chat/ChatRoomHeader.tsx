import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { appColors } from '../../constants/appColors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fontFamilies } from '../../constants/fontFamilies';
import { AvatarComponent } from '../../components';

const ChatRoomHeader = ({ route, navigation, user }: any) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      minWidth: 48,
      minHeight: 48,
      justifyContent: 'flex-start',  
    }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color={appColors.text} />
      </TouchableOpacity>

      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        {/* <Image 
          source={{uri: user?.avatar}}
          style={{height: hp(6.5), aspectRatio: 1, borderRadius: 100}}
        /> */}
        <AvatarComponent 
          avatar={user?.avatar}
          username={user?.username ? user?.username : user?.firstname + ' ' + user?.lastname}
          styles={{height: hp(6.5), width: hp(6.5), borderRadius: 100}}
        />
        <Text style={{fontSize: hp(2.5), fontFamily: fontFamilies.medium}}>
          {user?.firstname} {user?.lastname}
        </Text>
      </View>

    </View>
  )
}

export default ChatRoomHeader

const styles = StyleSheet.create({})