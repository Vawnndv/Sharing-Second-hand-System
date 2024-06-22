import { Timestamp, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../firebaseConfig";
import { getUserTokensService } from '../redux/services/userServices';

export class HandleNotification {

    static sendPushFCMNotification = async (fcmtoken: string, title: string, body: string, link: string) => {
      const message = {
        to: fcmtoken,
        sound: "default",
        title,
        body,
        data: { url: link }

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

    static sendPushNotification = async (data: any) => {
      try {
        
        const fcmtokens: string[] = await await getUserTokensService(data.userReceiverId);
          
          const body = data.name ? `${data.name} ${data.body}` : `${data.body}`; 
        // if (fcmtokens.length > 0) {
          fcmtokens.forEach(async (expoPushToken: string) => {
            HandleNotification.sendPushFCMNotification(expoPushToken, data.title, body, data.link);
          })
        // }
      } catch(err: any) {
        console.error(err.message);
      }
    }

    static sendNotification = async (data: any) => {
        try {
            const docRef = doc(db, "receivers", data.userReceiverId.toString());
          
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
              await setDoc(docRef, {
                receiver_id: data.userReceiverId,
                send_id: data.userSendId,
                createdAt: Timestamp.fromDate(new Date())
              });
            }
          
            // Generate a new document reference with a unique ID
            const notificationRef = collection(docRef, "notification");
            const newNotificationRef = doc(notificationRef);
          
            await setDoc(newNotificationRef, {
              id: newNotificationRef.id,
              userid: data.userReceiverId,
              title: data.title,
              body: data.body,
              name: data.name,
              // postid: data.postid,
              avatar: data.avatar,
              link: data.link,
              createdAt: Timestamp.fromDate(new Date()),
              isRead: false
          });

          await HandleNotification.sendPushNotification(data)
          } catch(err: any) {
            console.error(err.message);
          }
    }
}