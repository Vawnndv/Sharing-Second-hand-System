import { Item } from '../Item';
import pool from '../../config/DatabaseConfig';
import { QueryResult } from 'pg';

export class ItemManager {
  public constructor() {

  }

  public giveItem(postID: string, userID: string): void {
    // code here
  }

  public receiveItem(postID: string, userID: string): void {
    // code here
  }

  public filterItem(itemName: string): Item[] {
    // code here
    return [];
  }

  public searchItem(stringSearch: string): Item[] {
    // code here
    return [];
  }

  static async viewDetailsItem(itemId: number): Promise<Item | null> {
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

}