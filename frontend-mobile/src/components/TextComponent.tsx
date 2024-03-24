import { View, Text, TextStyle, StyleProp, Platform } from 'react-native'
import React from 'react'
import globalStyles from '../styles/globalStyles';

interface Props {
  text: string;
  color?: string;
  size?: string;
  flex?: string;
  font?: string;
  styles?: StyleProp<TextStyle>;
  title?: boolean;
};

const TextComponent = (props: Props) => {
  const {text, color, size, flex, font, styles, title} = props;

  const fontSizeDefault = Platform.OS === 'ios' ? 16 : 14;

  return (
    <Text
      style={[
        globalStyles.text,
      ]}
    >TextComponent</Text>
  )
}

export default TextComponent