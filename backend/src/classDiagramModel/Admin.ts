import { Account } from './Account';
import { CollaboratorManager } from './Manager/CollaboratorManager';
import { StatisticManager } from './Manager/StatisticManager';
import { WarehouseManager } from './Manager/WarehouseManager';

export class Admin extends Account {
    
  private statistic: StatisticManager | undefined;

  private userManager: CollaboratorManager | undefined;

  private warehouseManager: WarehouseManager | undefined;

  public constructor(userID: string, roleID: string, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, username: string,
    password: string) {
    super(userID, roleID, dateOfBirth, avatar, email, phoneNumber, lastName, firstName, username, password);
  }
}