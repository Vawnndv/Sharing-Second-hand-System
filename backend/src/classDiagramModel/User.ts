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

  public static mapManager: MapManager = new MapManager();

  public static postManager: PostManager = new PostManager();

  public static itemManager: ItemManager = new ItemManager();

  public static orderManager: OrderManager = new OrderManager();

  public static reportManager: ReportManager = new ReportManager();

  public static userManager: UserManager = new UserManager();

  public static addressManager: AddressManager = new AddressManager()

  public static ratingManager: RatingManager = new RatingManager()

  public constructor(userID: string, roleID: string, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, address: string, username: string,
    password: string) {
    super(userID, roleID, dateOfBirth, avatar, email, phoneNumber
      , lastName, firstName, address, username, password);
  }
}