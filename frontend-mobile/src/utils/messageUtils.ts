// messageUtils.ts
import { collection, doc, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const checkMessages = async (roomID: string, authId: string) => {
  const parts = roomID.split('-');
  
  if (parts.length === 1) {
    return 0; // Skip if roomID has only one part
  }

  const userIDs = parts.slice(0, 2);
  const currentUserId = String(authId);

  if (!userIDs.includes(currentUserId)) {
    return 0;
  }
  
  const docRef = doc(db, "rooms", roomID);
  const messagesRef = collection(docRef, "messages");
  const q = query(messagesRef, orderBy('createdAt', 'desc'));
  
  return new Promise<number>((resolve) => {
    onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map(doc => doc.data());
      let unreadCount = 0;
      if (allMessages.length > 0) {
        if (allMessages[0] && allMessages[0].isRead === undefined) {
        } else if (!allMessages[0].isRead && allMessages[0].userid !== currentUserId) {
          unreadCount += 1;
        }
      }
      resolve(unreadCount);
    });
  });
};

export const processRooms = (authId: string, setUnreadMessagesCount: (count: number) => void) => {
  try {
    const roomsCollection = collection(db, "rooms");

    onSnapshot(roomsCollection, async (roomsSnapshot) => {
      try {
        
        const promises = roomsSnapshot.docs.map(doc => checkMessages(doc.id, authId));
        const results = await Promise.all(promises);
        const totalUnread = results.reduce((sum, count) => sum + count, 0);
        setUnreadMessagesCount(totalUnread);
      } catch (error) {
        console.log("Error processing rooms: ", error);
      }
    });

  } catch (error) {
    console.log(error);
  }
};

