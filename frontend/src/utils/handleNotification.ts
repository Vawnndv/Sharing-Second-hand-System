import { Timestamp, addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from "../../firebaseConfig";

export class HandleNotification {
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

            const message = {
              to: 'ExponentPushToken[rV1zD6PKVlrbHHyVOasuSm]',
              sound: "default",
              title: data.name,
              body: data.text,
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
            console.log('fcm token end')

            console.log("notification, end 123");
          } catch(err: any) {
            console.error(err.message);
          }
    }
}