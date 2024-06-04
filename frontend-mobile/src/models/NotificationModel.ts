import { Timestamp } from "firebase/firestore";
export interface NotificationModel {
  userid: string;
  text: string;
  postid: string;
  name: string;
  avatar: string;
  link: string;
  createdAt: Timestamp;
  isRead: boolean;
}