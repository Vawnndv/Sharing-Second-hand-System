import { MaterialIcons } from '@expo/vector-icons'
import { Clock } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'
import { AvatarComponent, ContainerComponent, RowComponent, SpaceComponent, TextComponent } from '../../components'
import { appColors } from '../../constants/appColors'
import { fontFamilies } from '../../constants/fontFamilies'
import { globalStyles } from '../../styles/globalStyles'
import { NotificationModel } from '../../models/NotificationModel'
import { doc, collection, query, orderBy, onSnapshot, DocumentData, getDocs, limit, updateDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { authSelector } from '../../redux/reducers/authReducers'
import { db } from '../../../firebaseConfig'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import LoadingComponent from '../../components/LoadingComponent'

const NotificationScreen = () => {

  const auth = useSelector(authSelector);
  const navigation: any = useNavigation();
  console.log(auth.id)
  const [isLoading, setIsLoading] = useState(false);
  const [notificationList, setNotificationList] = useState<NotificationModel[]>([]);

  const updateRead = async (postid: string) => {
    try {

      const docRef = doc(db, "receivers", auth.id.toString());
      const messageRef = collection(docRef, "notification");
  
      // Lấy tin nhắn cuối cùng từ bộ sưu tập "messages"
      const querySnapshot = await getDocs(query(messageRef));
      let notificationItem: any = null; // Khai báo kiểu dữ liệu cho lastMessage
  
      // eslint-disable-next-line @typescript-eslint/no-shadow
      querySnapshot.forEach((doc) => {
        if (doc.data().postid === postid) {
          console.log(doc.data().postid, postid, '1233123123')
          notificationItem = doc
        }
      });

      if (notificationItem) {

        await updateDoc(notificationItem.ref, {
          isRead: true
        });
        notificationItem = null
      }
    } catch(err) {
      console.error('Lỗi khi cập nhật trạng thái tin nhắn:', err);
    }
  }
    
  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, "receivers", auth.id.toString());
    const messagesRef = collection(docRef, "notification");
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot)=> {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const list: any = snapshot.docs.map(doc=>{
        return doc.data();      
      })

      setNotificationList(list);
      console.log(notificationList)
      setIsLoading(false);
    })
  }, [])

  return (
    <ContainerComponent back title='Thông báo'>
      {isLoading ? (
        <LoadingComponent isLoading={isLoading} />
      ) : (
        <FlatList
          data={notificationList}
          renderItem={({item, index}) => (
            <RowComponent 
              key={`event${index}`}
              onPress={() => {
                navigation.navigate('Home', {
                  screen: item.link,
                  params: {
                    postID: item.postid
                  },
                });
                updateRead(item.postid);
                console.log(item.postid, 'itemitemitem')
              }}
              styles={{padding: 12, backgroundColor: item.isRead ? '#ffffff' : '#A2C3F6', marginBottom: 4}}
            >
              <AvatarComponent
                username={item.name} 
                size={78}
              />
              <SpaceComponent width={12} />
              <View style={[globalStyles.col]}>
                <RowComponent>
                  <TextComponent text={`${item.name} `} font={fontFamilies.medium} text2={item.text} isConcat />
                </RowComponent>
                <RowComponent justify='space-between'>
                  <RowComponent>
                    <Clock size={14} color={appColors.black} />
                    <SpaceComponent width={4} />
                    <TextComponent text={moment(item.createdAt.seconds * 1000 + item.createdAt.nanoseconds / 1000000).fromNow()} font={fontFamilies.light} />
                  </RowComponent>
                  <RowComponent>
                    <MaterialIcons name="more-horiz" color={appColors.black} variant='Bold' size={24}/>
                  </RowComponent>
                </RowComponent>
              </View>
            </RowComponent>
          )}
        />
      )}
    </ContainerComponent>
  )
}

export default NotificationScreen