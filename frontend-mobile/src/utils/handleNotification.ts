import { Alert } from "react-native";
import { db } from "../../firebaseConfig";
import { DocumentData, Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';

export class HandleNotification {
    static sendNotification = async (data: any) => {
        try {
            const docRef = doc(db, "receivers",  data.userReceiverId.toString());
          
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
              await setDoc(docRef, {
                receiver_id: data.userReceiverId,
                send_id: data.userSendId,
                createdAt: Timestamp.fromDate(new Date())
              });
            }
          
            const notificationRef = collection(docRef, "notification");
          
            await addDoc(notificationRef, {
              userid: data.userReceiverId,
              text: data.text,
              postid: data.postid,
              name: data.name,
              type: 'text',
              avatar: data.avatar,
              link: data.link,
              createdAt: Timestamp.fromDate(new Date()),
              isRead: false
            });
            console.log("notification, end");
          } catch(err: any) {
            Alert.alert('Lỗi', err.message)
            console.error(err.message);
          }
    }
}