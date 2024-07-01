import { CardManager } from './Manager/CardManager';
import { CollaboratorOrderManager } from './Manager/CollaboratorOrderManager';
import { CollaboratPostManager } from './Manager/CollaboratorPostManager';
import { OrderManager } from './Manager/OrderManager';
import { PostManager } from './Manager/PostManager';
import { StatisticManager } from './Manager/StatisticManager';
import { UserManager } from './Manager/UserManager';
import { User } from './User';


export class Collaborator extends User {

  public static collaboratorID: string | undefined;

  public static statistic: StatisticManager = new StatisticManager();

  public static userManager: UserManager = new UserManager();

  public static cardManager: CardManager = new CardManager();
  
  public static orderManager: OrderManager = new OrderManager()

  public static postManager: PostManager = new PostManager();
  static adminDeleteCollaboratorReducer: any;
  static adminEditCollaboratorReducer: any;

  public constructor(userID: string, roleID: string, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, username: string,
    password: string, address: string) {
    super(userID, roleID, dateOfBirth, avatar, email, phoneNumber, lastName, firstName, username, password, address);
    this.postManager = new CollaboratPostManager();
    this.orderManager = new CollaboratorOrderManager();
  }
}