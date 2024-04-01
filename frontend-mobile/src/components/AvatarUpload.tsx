import { View, Text, TouchableOpacity, Image, ViewStyle, ImageStyle } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { appColors } from '../constants/appColors'
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons'

interface Props {
  uri: string;
  style?: ViewStyle;
  imgStyle?: ImageStyle;
  onPress?: () => void;
  onButtonPress: () => void;
  aviOnly?: boolean;
}
const AvatarUpload = (props: Props) => {
  const {
    uri,
    style,
    imgStyle,
    onPress,
    onButtonPress,
    aviOnly = false,
  } = props;

    
  const url = 'https://gamek.mediacdn.vn/133514250583805952/2022/5/18/photo-1-16528608926331302726659.jpg';

  return (
    <View style={[styles.container, {marginBottom: aviOnly ? 0 : 15}, style]}>
      <TouchableOpacity>
          <Image
            source={uri ? { uri: uri } : { uri: url }}
            style={[
              styles.image,
              aviOnly && { height: 35, width: 35, borderWidth: 0},
              imgStyle,
            ]}
          />
          {!aviOnly && (
            <TouchableOpacity style={styles.editButton} onPress={onButtonPress}>
              <MaterialCommunityIcons name='camera-outline' size={30} color={appColors.primary} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
    </View>
  )
}

export default AvatarUpload


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },

  image: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: appColors.gray5,
  },

  editButton: {
    backgroundColor: appColors.gray5,
    borderRadius: 24,
    padding: 8,
    position: 'absolute',
    right: 5,
    bottom: 5,
  },
})