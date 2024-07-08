import { User } from './User';
import { CardManager } from './Manager/CardManager';
import { CollaboratorOrderManager } from './Manager/CollaboratorOrderManager';
import { CollaboratorPostManager } from './Manager/CollaboratorPostManager';
import { OrderManager } from './Manager/OrderManager';
import { PostManager } from './Manager/PostManager';
import { StatisticManager } from './Manager/StatisticManager';
import { UserManager } from './Manager/UserManager';
import { Account } from './Account';
import { MapManager } from './Manager/MapManager';
import { ItemManager } from './Manager/ItemManager';
import { ReportManager } from './Manager/ReportManager';
import { AddressManager } from './Manager/AddressManager';
import { RatingManager } from './Manager/RatingManager';

export class Collaborator extends User {

  public static statistic: StatisticManager = new StatisticManager();
  public static userManager: UserManager = new UserManager();
  public static cardManager: CardManager = new CardManager();
  public static orderManager: OrderManager = new OrderManager();
  public static postManager: CollaboratorPostManager = new CollaboratorPostManager();

  static adminDeleteCollaboratorReducer: any;
  static adminEditCollaboratorReducer: any;

  public constructor(userID: string, roleID: string, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, address: string, username: string,
    password: string) {
    super(userID, roleID, dateOfBirth, avatar, email, phoneNumber,
      lastName, firstName, address, username, password);
  }
}
