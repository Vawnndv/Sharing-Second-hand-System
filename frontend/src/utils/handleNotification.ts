import { Timestamp, addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../firebaseConfig";
import { getUserTokensService } from '../redux/services/userServices';

export class HandleNotification {

    static sendPushFCMNotification = async (fcmtoken: string, title: string, body: string) => {
      const message = {
        to: fcmtoken,
        sound: "default",
        title,
        body,
      };
    
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(message),
      });
    }

    static sendPushNotification = async (id: string, data: any) => {
      try {
        const fcmtokens: string[] = await await getUserTokensService(id);
        if (fcmtokens.length > 0) {
          fcmtokens.forEach(async (expoPushToken: string) => {
            HandleNotification.sendPushFCMNotification(expoPushToken, data.name, data.text);
          })
        }
      } catch(err: any) {
        console.error(err.message);
      }
    }

    static sendNotification = async (data: any) => {
        try {
            const docRef = doc(db, "receivers",  data.userReceiverId.toString());
            console.log('fcm token start')
          
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

            console.log('fcm token midlde')

           
            console.log('fcm token end')

            console.log("notification, end 123");
          } catch(err: any) {
            console.error(err.message);
          }
    }
}