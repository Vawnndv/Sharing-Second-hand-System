import React, { ReactNode } from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';

interface StyledTextProps {
  children: ReactNode;
  big?: boolean;
  small?: boolean;
  style?: StyleProp<TextStyle>;
}

const StyledText: React.FC<StyledTextProps> = ({ children, big, small, style }) => {
  return (
    <Text style={[styles.text, big && styles.big, small && styles.small, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'black',
  },
  big: {
    fontSize: 20,
  },
  small: {
    fontSize: 12,
  },
});

export default StyledText;
