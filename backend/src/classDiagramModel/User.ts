import { Account } from './Account';
import { ItemManager } from './Manager/ItemManager';
import { MapManager } from './Manager/MapManager';
import { OrderManager } from './Manager/OrderManager';
import { PostManager } from './Manager/PostManager';
import { ReportManager } from './Manager/ReportManager';

export class User extends Account {

  protected mapManager: MapManager | undefined;

  protected postManager: PostManager | undefined;

  protected itemManager: ItemManager | undefined;

  protected orderManager: OrderManager | undefined;

  protected reportManager: ReportManager | undefined;

  public constructor(userID: number, roleID: number, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, username: string,
    password: string) {
    super(userID, roleID, dateOfBirth, avatar, email, phoneNumber
      , lastName, firstName, username, password);
  }
}