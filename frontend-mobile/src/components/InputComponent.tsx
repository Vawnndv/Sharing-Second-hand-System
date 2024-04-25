import { View, Text, KeyboardType, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { ReactNode, useRef, useState } from 'react'
import { appColors } from '../constants/appColors';
import {globalStyles} from '../styles/globalStyles';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import TextComponent from './TextComponent';

interface Props {
  value: string;
  onChange: (val: string) => void;
  affix?: ReactNode;
  placeholder?: string;
  suffix?: ReactNode;
  isPassword?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  onEnd?: () => void;
  error?: string;
  editable?: boolean;
};

const InputComponent = (props: Props) => {
  const {value, onChange, affix, suffix, placeholder, isPassword, allowClear, type, onEnd, error, editable} = props;
  const [isShowPassword, setIsShowPassword] = useState(isPassword ?? false);
  const inputRef = useRef<any>();


  const localStyle: any = {
    marginBottom: error ? 10 : 19,
    borderColor: error ? appColors.danger : appColors.gray3, 
  };

  return (
    <>
      <View style={[styles.inputContainer, localStyle]}>
        {affix ?? affix}
        <TextInput
          ref={inputRef}
          style={[styles.input, globalStyles.text]}
          value={value}
          placeholder={placeholder ?? ''}
          onChangeText={(val) => onChange(val)}
          secureTextEntry={isShowPassword}
          placeholderTextColor={'#747688'}
          keyboardType={type ?? 'default'}
          autoCapitalize="none"
          onEndEditing={onEnd}
          editable={editable ?? true}
        />
        {suffix ?? suffix}
        <TouchableOpacity 
          onPress={
            isPassword 
            ? () => setIsShowPassword(!isShowPassword) 
            : () => {onChange('');  inputRef.current.focus();}
          }
        >
          {isPassword ? (
            <FontAwesome name={isShowPassword ? "eye-slash" : "eye"} size={22} color={appColors.gray} />
          ): (
            value.length > 0 && allowClear && (
              <AntDesign name="close" size={22} color={appColors.text} /> 
            )
          )}
        </TouchableOpacity>
      </View>
      {(error) && <TextComponent text={error}  color={appColors.danger} styles={{marginBottom: 9, textAlign: 'right'}}/>}
    </>
  )
}

export default InputComponent

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray3,
    width: '100%',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: appColors.white,
  },

  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    paddingHorizontal: 14,
    color: appColors.text,
  },
});