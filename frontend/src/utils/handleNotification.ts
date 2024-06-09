import { Timestamp, addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../firebaseConfig";
import { getUserTokensService } from '../redux/services/userServices';

export class HandleNotification {

    static sendPushFCMNotification = async (fcmtoken: string, title: string, body: string) => {
      console.log(fcmtoken,' 1231312313')
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
        console.log(fcmtokens.length)

        // if (fcmtokens.length > 0) {
          console.log(fcmtokens)
          fcmtokens.forEach(async (expoPushToken: string) => {
            console.log(expoPushToken,' 1231312313')
            HandleNotification.sendPushFCMNotification(expoPushToken, data.name, data.text);
          })
        // }
      } catch(err: any) {
        console.error(err.message);
      }
    }

    static sendNotification = async (data: any) => {
        try {

            await HandleNotification.sendPushNotification('83', data)

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

          } catch(err: any) {
            console.error(err.message);
          }
    }
}