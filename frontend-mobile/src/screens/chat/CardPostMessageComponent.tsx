import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import CardComponent from '../../components/CardComponent'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { fontFamilies } from '../../constants/fontFamilies'
import { useNavigation } from '@react-navigation/native'

const CardPostMessageComponent = ({route, navigation, title, uri, postid}: any) => {
  const [imageSize, setImageSize] = useState({ width: wp(50), height: wp(50) });

  return (
    <CardComponent
      onPress={() => navigation.navigate('ItemDetailScreen', {
        postId : postid,
      })}
      isShadow
    >
      <Image
        source={{ uri }}
        style={{
          width: imageSize.width,
          height: imageSize.height,
          resizeMode: 'cover',
        }}
      />
      <View>
      <Text style={{ fontFamily: fontFamilies.bold }}>{title}</Text>
      </View>
    </CardComponent>
  )
}

export default CardPostMessageComponent

const styles = StyleSheet.create({})