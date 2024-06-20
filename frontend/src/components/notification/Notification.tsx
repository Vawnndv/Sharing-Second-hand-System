import './style.scss'
import * as React from 'react'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import { teal } from '@mui/material/colors'
import { Timestamp, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import { RootState } from '../../redux/store'
import NotificationItem from './NotificationItem'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export interface NotificationModel {
  id: string;
  userid: string;
  body: string;
  title: string;
  name: string;
  avatar: string;
  link: string;
  createdAt: Timestamp;
  isRead: boolean;
}

function Notification() {
    
  const { userInfo } = useSelector( (state: RootState) => state.userLogin);
  const [notificationList, setNotificationList] = React.useState<NotificationModel[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    if (userInfo?.id) {
      const docRef = doc(db, "receivers", userInfo?.id.toString());
      const messagesRef = collection(docRef, "notification");
      const q = query(messagesRef, orderBy('createdAt', 'desc'));

      onSnapshot(q, (snapshot)=> {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const list: any = snapshot.docs.map(doc=>{
          return doc.data();      
        })

        setNotificationList(list);
      })
    } else {
      console.error('User ID is not defined');
    }
  }, []);

  const handleClickAll = async () => {
    try {
      
      if (userInfo?.id) {
        const batch = writeBatch(db);

       // Iterate through notificationList and add update operations to the batch
        notificationList.forEach(notification => {
          if (!notification.isRead) {
            const docRef = doc(db, "receivers", userInfo?.id.toString(), "notification", notification.id);
            batch.update(docRef, { isRead: true });
          }
        });

        // Commit the batch
        await batch.commit();

        // Update the state only after all updates are completed
        setNotificationList(prevList => 
          prevList.map(notification => ({
            ...notification,
            isRead: true
          }))
        );
      } else {
        console.error('User ID is not defined');
      }
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  }

  const updateRead = async (id: string) => {
    try {
      if (userInfo?.id) {
        const docRef = doc(db, "receivers", userInfo?.id.toString(), "notification", id);
        
        // Update the document
        await updateDoc(docRef, {
            isRead: true
        });
      } else {
        console.error('User ID is not defined');
      }
    } catch(err) {
        console.error('Error updating notification:', err);
    }
  };

  const onDeletePressed = async (id: string) => {
    try {
      if (userInfo?.id) {
        const docRef = doc(db, "receivers", userInfo?.id.toString(), "notification", id);

        // Delete the document
        await deleteDoc(docRef);
      } else {
        console.error('User ID is not defined');
      }
    } catch (err) {
        console.error('Error deleting notification:', err);
    }
  };

  return (
    <Card>
      {/* Header */}
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', py: '0!important', color: '#321357' }} px={2}>
          Thông báo
        </Typography>
      </CardContent>

      {/* Body with scrolling */}
      <CardContent sx={{ overflowY: 'auto', maxHeight: '60vh', padding: '0!important' }}>
          <Stack sx={{ width: '400px' }}>
            {notificationList.length > 0 ? (
              notificationList.map((item, index) => (
                // eslint-disable-next-line react/jsx-key
                <NotificationItem
                  key={index}
                  item={item} 
                  onDeletePressed={onDeletePressed} updateRead={updateRead}
                />
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  color: '#FF0000'
                }}
              >
                Trống
              </Typography>
            )}
          </Stack>
      </CardContent>
      <CardContent sx={{ padding: '0!important' }}>
        {notificationList.length > 0 && (
          <Typography
            variant="body1"
            sx={{
              '&:hover, &:active': {
                textDecoration: 'underline',
                cursor: 'pointer'
              },
              py: 1,
              textAlign: 'center',
              color: teal[300],
              fontWeight: 'bold', // Corrected the typo in fontWeight
              margin: 'auto', // Center the text horizontally
              display: 'block' // Ensure block-level display for margin: 'auto' to work
            }}
            onClick={handleClickAll}
          >
            Đọc hết
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default Notification