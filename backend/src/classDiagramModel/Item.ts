import pool from '../config/DatabaseConfig';
import { QueryResult } from 'pg';


export class Item {
  private itemID: number | undefined;

  private name: string | undefined;

  private quantity: number | undefined;

  private itemtypeid: number | undefined;
    
  public constructor(itemID: number, name: string, quantity: number) {
    this.itemID = itemID;
    this.name = name;
    this.quantity = quantity;
  }

  static async getAllItems(): Promise<Item[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM item');
      return result.rows.map((row: any) => new Item(row.itemID, row.name, row.quantity));
    } finally {
      return null;
    }
  }

  static async getItemById(itemId: number): Promise<Item | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM items WHERE id = $1', [itemId]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return new Item(row.itemId, row.name, row.quantity);
    } finally {
      return null;
    }
  }



  public static async createItem (name: string, quantity: number, itemtypeID: number): Promise<void> {

    const client = await pool.connect();
    const query = `
        INSERT INTO item(name, quantity, itemtypeID)
        VALUES($1, $2, $3)
        RETURNING *;
      `;
    const values : any = [name, quantity, itemtypeID];
    
    try {
      const result: QueryResult = await client.query(query, values);
      console.log('Product inserted successfully:', result.rows[0]);
    } catch (error) {
      console.error('Error inserting product:', error);
    } 
  };


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