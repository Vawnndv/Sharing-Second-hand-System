import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'

const ChatList = ({users, router, navigation} : any) => {

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={users}
        contentContainerStyle={{marginTop: 8}}
        keyExtractor={item=> Math.random().toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => <ChatItem 
          noBorder={index+1 == users.length}
          router={router}
          navigation={navigation}
          item={item}
          index={index}
        />}
      />
    </View>
  )
}

export default ChatList

const styles = StyleSheet.create({})