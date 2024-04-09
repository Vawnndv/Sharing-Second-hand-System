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

  public static async viewDetailsItem(itemId: number): Promise<Item | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM "item" WHERE itemid = $1`, [itemId]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      const itemTest = new Item(row.itemid, row.name, row.quantity, row.itemtypeid);
      return new Item(row.itemid, row.name, row.quantity, row.itemtypeid);

    } finally {
      client.release()
    }
  }

  public static async viewItemImages(itemId: number): Promise<any[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM image WHERE itemid = $1`, [itemId]);
      if (result.rows.length === 0) {
        return [];
      }
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  } 


  public static async viewAllItemTypes(): Promise<any[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM item_type`);
      if (result.rows.length === 0) {
        return [];
      }
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
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
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting product:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

}