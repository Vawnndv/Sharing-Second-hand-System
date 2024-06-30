import { Account } from './Account';
import { CollaboratorManager } from './Manager/CollaboratorManager';
import { StatisticManager } from './Manager/StatisticManager';
import { WarehouseManager } from './Manager/WarehouseManager';
import { ChatManager } from './Manager/ChatManager';
import { NotiManager } from './Manager/NotiManager';

export class Admin extends Account {
    
  public static statistic: StatisticManager = new StatisticManager();

  public static userManager: CollaboratorManager = new CollaboratorManager();

  public static warehouseManager: WarehouseManager = new WarehouseManager();

  public constructor(userID: string, roleID: string, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, username: string,
    password: string, address: string) {
    super(userID, roleID, dateOfBirth, avatar, email, phoneNumber, lastName, firstName, username, password, address);
  }
}