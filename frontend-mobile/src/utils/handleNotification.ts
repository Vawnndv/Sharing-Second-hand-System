import { Timestamp, addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { Alert } from "react-native";
import { db } from "../../firebaseConfig";
import { usePushNotifications } from './usePushNotification';

export class HandleNotification {
    static sendNotification = async (data: any) => {
        try {
            await usePushNotifications.sendPushNotification(data);

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

            // Set the document with the ID included in the data
            await setDoc(newNotificationRef, {
                id: newNotificationRef.id,
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

        } catch (err: any) {
            Alert.alert('Lỗi', err.message);
            console.error(err.message);
        }
    }
}
