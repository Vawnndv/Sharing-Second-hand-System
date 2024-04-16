import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ContainerComponent } from '../../components'
import { StatusBar } from 'expo-status-bar'
import ChatList from './ChatList'
import { ActivityIndicator } from 'react-native-paper'
import chatAPI from '../../apis/chatApi'

const userID = "0"

const ChatScreen = ({ router, navigation } : any) => {
  const [users, setUsers] = useState([])

  useEffect(() => {

    getUsers()
  }, [])

  const getUsers = async ()=> {
    try {
      const res = await chatAPI.HandleChat(
        `/list?userID=${userID}`,
        'get'
      );
      setUsers(res.data)
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ContainerComponent back right title='Tin nhắn'>
      {/* <Text>Chat Screen</Text> */}
      <StatusBar style='light'/>

      {
        users.length > 0 ? (
          <ChatList route={router} navigation={navigation} users={users}/>
        ) : (
          <View style={{display: 'flex', alignItems: 'center', paddingTop: 30}}>
            <ActivityIndicator size={30}/>
          </View>
        )
      }
    </ContainerComponent>
  )
}

export default ChatScreen

const styles = StyleSheet.create({})