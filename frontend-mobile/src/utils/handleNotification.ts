import { Alert } from "react-native";
import { db } from "../../firebaseConfig";
import { DocumentData, Timestamp, addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { usePushNotifications } from "./usePushNotification";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export class HandleNotification {
    static sendNotification = async (data: any) => {
        const {getItem} = useAsyncStorage('fcmtoken');
          const res = await getItem();
      
        const expoPushToken = JSON.parse(res ?? '');
        console.log(expoPushToken, ' expoPushToken expoPushToken expoPushToken')

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
              to: expoPushToken?.data,
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
              body: JSON.stringify(message),
            });
            console.log('fcm token end')
          } catch(err: any) {
            Alert.alert('Lỗi', err.message)
            console.error(err.message);
          }
    }
}