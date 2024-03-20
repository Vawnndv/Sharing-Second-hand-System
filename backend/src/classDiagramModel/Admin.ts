import { Account } from './Account';
import { CollaboratorManager } from './Manager/CollaboratorManager';
import { StatisticManager } from './Manager/StatisticManager';
import { WarehouseManager } from './Manager/WarehouseManager';

export class Admin extends Account {
    
  private statistic: StatisticManager | undefined;

  private userManager: CollaboratorManager | undefined;

  private warehouseManager: WarehouseManager | undefined;

  public constructor(userID: string) {
    super(userID);
  }
}