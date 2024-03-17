import { ChatManager } from './Manager/ChatManager';
import { NotiManager } from './Manager/NotiManager';

export class Account {
  protected userID: string | undefined;

  protected roleID: string | undefined;

  protected dateOfBirth: string | undefined;

  protected avatar: string | undefined;

  protected email: string | undefined;

  protected phoneNumber: string | undefined;

  protected lastName: string | undefined;

  protected firstName: string | undefined;

  protected username: string | undefined;

  protected password: string | undefined;

  protected notiManager: NotiManager | undefined;

  protected chat: ChatManager | undefined;

  public constructor(userID: string) {
    this.userID = userID;
  }

  public editProfile(): void {
    // code here
  }
}