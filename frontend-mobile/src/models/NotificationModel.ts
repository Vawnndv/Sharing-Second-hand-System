import { Timestamp } from "firebase/firestore";
export interface NotificationModel {
  id: string;
  userid: string;
  title: string;
  body: string;
  // postid: string;
  name: string;
  avatar: string;
  link: string;
  createdAt: Timestamp;
  isRead: boolean;
}