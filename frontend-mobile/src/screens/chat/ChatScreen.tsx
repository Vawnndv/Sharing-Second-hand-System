import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ContainerComponent } from '../../components'
import { StatusBar } from 'expo-status-bar'
import ChatList from './ChatList'
import { ActivityIndicator } from 'react-native-paper'
import chatAPI from '../../apis/chatApi'
import { useDispatch, useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducers'

const ChatScreen = ({ router, navigation } : any) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector(authSelector);

  useEffect(() => {

    getUsers()
  }, [])

  const getUsers = async ()=> {
    try {
      setIsLoading(true)
      const res = await chatAPI.HandleChat(
        `/list?userID=${auth?.id}`,
        'get'
      );
      setUsers(res.data)
      setIsLoading(false)
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ContainerComponent back right title='Tin nhắn'>
      {/* <Text>Chat Screen</Text> */}
      <StatusBar style='light'/>

      {
        isLoading ? (
          <View style={{display: 'flex', alignItems: 'center', paddingTop: 30}}>
            <ActivityIndicator size={30}/>
          </View>
        ) : (
          users.length > 0 ? (
            <ChatList route={router} navigation={navigation} users={users}/>
          ) : (
            <View style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../../assets/images/shopping.png')}
                style={styles.image} 
                resizeMode="contain"
              />
            </View>
          )
        )

      }
    </ContainerComponent>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 80,
  }
})