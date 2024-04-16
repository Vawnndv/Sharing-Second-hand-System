import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { appColors } from '../../constants/appColors';

const MessageItem = ({message, currentUser}: any) => {
  console.log(currentUser?.id, '  ', message?.userid)

  if (currentUser?.id == message?.userid) {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 5, marginRight: 10}}>
        <View>
          <View style={{paddingHorizontal: 10, display: 'flex', justifyContent: 'space-between', borderRadius: 100, backgroundColor: appColors.white}}>
            <Text style={{fontSize: hp(2.5), padding: 5}}>
              {message?.text}
            </Text>
          </View>
        </View> 
      </View>
    )
  } else {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 5, marginLeft: 10}}>
        <View>
          <View style={{paddingHorizontal: 10, display: 'flex', justifyContent: 'space-between', borderRadius: 100, backgroundColor: appColors.gray4}}>
            <Text style={{fontSize: hp(2.5), padding: 5}}>
              {message?.text}
            </Text>
          </View>
        </View> 
      </View>
    )
  }
}

export default MessageItem

const styles = StyleSheet.create({})