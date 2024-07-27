import pool from '../config/DatabaseConfig';
import { QueryResult } from 'pg';


export class Item {
  private itemID: number | undefined;

  private name: string | undefined;

  private quantity: number | undefined;
  
  private nametype: string | undefined;

  public itemtypeid: any;
    
  public constructor(itemID: number, name: string, quantity: number, itemtypeid: number, nametype: string) {
    this.itemID = itemID;
    this.name = name;
    this.quantity = quantity;
    this.itemtypeid = itemtypeid;
    this.nametype = nametype
  }

  static async getAllItems(): Promise<Item[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM item');
      return result.rows.map((row: any) => new Item(row.itemID, row.name, row.quantity, row.itemtypeid, ''));
    } finally {
      return null;
    }
  }

  public getItemID(): number {
    return -1
  }

  public updateItem(itemID: string, name: string, quantity: number): void {
    
  }

  public deleteItem(): void {
    
  }
}