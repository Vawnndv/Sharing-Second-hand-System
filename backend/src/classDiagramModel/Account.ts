import { ChatManager } from './Manager/ChatManager';
import { NotiManager } from './Manager/NotiManager';

export class Account {
  protected userID: number | undefined;

  protected roleID: number | undefined;

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

  public constructor(userID: number, roleID: number, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, username: string,
    password: string) {
    this.userID = userID;
    this.roleID = roleID;
    this.dateOfBirth = dateOfBirth;
    this.avatar = avatar;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.lastName = lastName;
    this.firstName = firstName;
    this.username = username;
    this.password = password;
  }

  public editProfile(): void {
    // code here
  }
}