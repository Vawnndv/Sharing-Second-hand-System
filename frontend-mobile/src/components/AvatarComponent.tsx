import React from 'react';
import {
  Image,
  ImageProps,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyles';
import TextComponent from './TextComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  avatar?: string;
  username: string;
  size?: number;
  styles?: StyleProp<ImageProps>;
  isBorder?: boolean;
  onPress?: () => void;
  isEdit?: boolean;
  onButtonPress?: () => void;
  isNumber?: boolean;
}

const AvatarComponent = (props: Props) => {
  const {avatar, username, size, styles, onPress, isEdit, onButtonPress, isBorder, isNumber} = props;

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      {avatar ? (
        <Image
          source={{uri: avatar}}
          style={[
            {
              width: size ?? 40,
              height: size ?? 40,
              borderRadius: 100,
              borderWidth: isBorder ? 5: 1,
              borderColor: isBorder ? appColors.gray2 : appColors.white,
            },
            isEdit && localStyles.container,
            styles,
          ]}
        />
      ) : (
        <View
          style={[
            globalStyles.center,
            {
              width: size ?? 40,
              height: size ?? 40,
              borderRadius: 100,
              borderWidth: isBorder ? 5: 1,
              borderColor: isBorder ? appColors.gray2 : appColors.white,
              backgroundColor: !isNumber ? appColors.primary : appColors.danger,
            },
            isEdit && localStyles.container,
            styles,
          ]}>
          <TextComponent
            text={!isNumber ? username.substring(0, 1).toLocaleUpperCase() : username}
            font={fontFamilies.bold}
            color={appColors.white}
            size={size ? size / 2.5 : 14}
          />
        </View>
      )}
      {isEdit && (
            <TouchableOpacity style={localStyles.editButton} onPress={onButtonPress}>
              <MaterialCommunityIcons name='camera-outline' size={30} color={appColors.primary} />
            </TouchableOpacity>
          )}
    </TouchableOpacity>
  );
};

export default AvatarComponent;


const localStyles = StyleSheet.create({
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