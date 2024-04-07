import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import TextComponent from './TextComponent';

interface Props {
  isLoading: boolean;
  values: number;
  message?: string;
};

const LoadingComponent = (props :Props) => {
  const {isLoading, values, message} = props;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        values === 0 && <TextComponent text={message ?? 'Data not found!'} /> 
      )}
    </View>
  )
}

export default LoadingComponent