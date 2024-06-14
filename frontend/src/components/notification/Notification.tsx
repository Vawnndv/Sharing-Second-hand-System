import './style.scss'

import { Card, CardContent, Stack, Typography } from '@mui/material'
import { teal } from '@mui/material/colors'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { db } from '../../../firebaseConfig'
import { NotificationModel } from '../../layout/Header'
import { RootState } from '../../redux/store'
import NotificationItem from './NotificationItem'

interface Props{
  notificationList: NotificationModel[]; 
}



function Notification(props: Props) {
  const {notificationList} = props; 
    
  const { userInfo } = useSelector( (state: RootState) => state.userLogin);

  const handleClickAll = async () => {
    try {
      if (userInfo?.id) {
        const notificationRef = collection(db, "receivers", userInfo.id.toString(), "notification");
      
        // Get all documents in the notification subcollection
        const querySnapshot = await getDocs(notificationRef);
  
        // Iterate over each document and delete it
        // eslint-disable-next-line @typescript-eslint/no-shadow
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log(`Notification with ID ${doc.id} has been deleted`);
        });
        
        console.log('All notifications have been cleared');
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
        console.log(`Notification with id ${id} has been marked as read`);
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
        console.log(`Notification with id ${id} has been deleted`);
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
        <Typography variant="h6" sx={{ fontWeight: 'bold', py: '0!important', color: teal[400] }} px={2}>
          Thông báo
        </Typography>
      </CardContent>

      {/* Body with scrolling */}
      <CardContent sx={{ overflowY: 'auto', maxHeight: '60vh', padding: '0!important' }}>
        {/* {isLoading ? ( */}
          <Stack sx={{ width: '400px' }}>
            {notificationList.length > 0 ? (
              notificationList.map((item) => (
                // eslint-disable-next-line react/jsx-key
                <NotificationItem
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
                Empty
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
            Clear All
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default Notification