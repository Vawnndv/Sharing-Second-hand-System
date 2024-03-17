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

  public constructor(userID: string) {
    super(userID);
  }
}