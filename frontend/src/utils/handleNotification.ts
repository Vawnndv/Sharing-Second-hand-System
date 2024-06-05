import { Timestamp, addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../firebaseConfig";

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
            console.error(err.message);
          }
    }
}