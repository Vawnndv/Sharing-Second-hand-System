import pool from '../config/DatabaseConfig';
import { QueryResult } from 'pg';


export class Item {
  private itemID: number | undefined;

  private name: string | undefined;

  private quantity: number | undefined;

  private itemtypeid: number | undefined;
    
  public constructor(itemID: number, name: string, quantity: number, itemtypeid: number) {
    this.itemID = itemID;
    this.name = name;
    this.quantity = quantity;
    this.itemtypeid = itemtypeid;
  }

  static async getAllItems(): Promise<Item[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM item');
      return result.rows.map((row: any) => new Item(row.itemID, row.name, row.quantity, row.itemtypeid));
    } finally {
      return null;
    }
  }

  public getItemID(): number {
    return -1
  }


  // static async createItem(name: string, quantity: number, itemtypeID: number): Promise<void> {
  //   const client = await pool.connect();
  //   try {
  //     await client.query('INSERT INTO items(name, quantity, itemtypeID) VALUES($1, $2, $3)', [name, quantity, itemtypeID]) ;
  //   } finally {
  //     client.release();
  //   }
  // }

  
  

  public updateItem(itemID: string, name: string, quantity: number): void {
    // code here
  }

  public deleteItem(): void {
    // code here
  }
}