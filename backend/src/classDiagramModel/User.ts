import { Account } from './Account';
import { AddressManager } from './Manager/AddressManager';
import { ItemManager } from './Manager/ItemManager';
import { MapManager } from './Manager/MapManager';
import { OrderManager } from './Manager/OrderManager';
import { PostManager } from './Manager/PostManager';
import { RatingManager } from './Manager/RatingManager';
import { ReportManager } from './Manager/ReportManager';
import { UserManager } from './Manager/UserManager';

export class User extends Account {

  public static mapManager: MapManager;
  public static postManager: PostManager;
  public static itemManager: ItemManager;
  public static orderManager: OrderManager ;
  public static reportManager: ReportManager;
  public static userManager: UserManager;
  public static addressManager: AddressManager;
  public static ratingManager: RatingManager;

  public constructor(userID: string, roleID: string, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, address: string, username: string,
    password: string) {
    super(userID, roleID, dateOfBirth, avatar, email, phoneNumber,
      lastName, firstName, address, username, password);
  }
}
