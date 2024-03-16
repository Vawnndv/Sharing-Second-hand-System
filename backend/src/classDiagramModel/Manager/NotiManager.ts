import { Notification } from "../Notification";

export class NotiManager{
    public constructor(){

    }

    public getNotifications(userId: string): Notification[]{
        // code here
        return [];
    }

    public getNotificationDetails(notiId: string): Notification{
        // code here
        return new Notification('','','','','',[],'');
    }
}