import { CardManager } from './Manager/CardManager';
import { CollaboratorOrderManager } from './Manager/CollaboratorOrderManager';
import { CollaboratPostManager } from './Manager/CollaboratorPostManager';
import { OrderManager } from './Manager/OrderManager';
import { PostManager } from './Manager/PostManager';
import { StatisticManager } from './Manager/StatisticManager';
import { UserManager } from './Manager/UserManager';
import { User } from './User';


export class Collaborator extends User {

  private collaboratorID: string | undefined;

  private statistic: StatisticManager | undefined;

  private userManager: UserManager | undefined;

  private cardManager: CardManager | undefined;

  public constructor(userID: string, roleID: string, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, username: string,
    password: string) {
    super(userID, roleID, dateOfBirth, avatar, email, phoneNumber, lastName, firstName, username, password);
    this.postManager = new CollaboratPostManager();
    this.orderManager = new CollaboratorOrderManager();
  }
}