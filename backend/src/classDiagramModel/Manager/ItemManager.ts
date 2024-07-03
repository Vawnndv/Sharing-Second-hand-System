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

  public async viewDetailsItem(itemId: number): Promise<Item | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT i.*, it.nametype FROM "item" i
        INNER JOIN "item_type" it ON it.itemtypeid = i.itemtypeid
        WHERE itemid = $1`, [itemId]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return new Item(row.itemid, row.name, row.quantity, row.itemtypeid, row.nametype);

    } finally {
      client.release()
    }
  }

  public async viewItemImages(itemId: number): Promise<any[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM image WHERE itemid = $1`, [itemId]);
      if (result.rows.length === 0) {
        return [];
      }
      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  } 

  public async viewAllItemTypes(): Promise<any[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM item_type`);
      if (result.rows.length === 0) {
        return [];
      }
      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  } 

  public async createItem (name: string, quantity: number, itemtypeID: number): Promise<void> {
    const client = await pool.connect();
    const query = `
        INSERT INTO item(name, quantity, itemtypeID)
        VALUES($1, $2, $3)
        RETURNING *;
      `;
    const values : any = [name, quantity, itemtypeID];
    
    try {
      const result: QueryResult = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting product:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public async uploadImageItem (path: string, itemID: string): Promise<boolean> {
    const client = await pool.connect();
    const query = `
        INSERT INTO "image" (path, itemid)
        VALUES ('${path}',${itemID});
      `;
    // const values : any = [name, quantity, itemtypeID];
    
    try {
      const result: QueryResult = await client.query(query);

    
      return true;
      
    } catch (error) {
      console.error('Error inserting product:', error);
      return false
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public async deleteImageItem (imgid: number): Promise<boolean> {

    const client = await pool.connect();
    const query = `
      DELETE FROM IMAGE WHERE imgid = ${imgid};
    `;
    // const values : any = [name, quantity, itemtypeID];
    
    try {
      const result: QueryResult = await client.query(query);
      return true;
      
    } catch (error) {
      console.error('Error deleting image:', error);
      return false
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

}