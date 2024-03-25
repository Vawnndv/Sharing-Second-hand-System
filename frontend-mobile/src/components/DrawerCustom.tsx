import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native'
import React from 'react'

const DrawerCustom = ({navigation}: any) => {
  return (
    <View style={[localStyles.container]}>
      <Text>DrawerCustom</Text>
    </View>
  )
}

export default DrawerCustom

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
    marginBottom :12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },

  listItemText: {
    paddingLeft: 12,
  }
})