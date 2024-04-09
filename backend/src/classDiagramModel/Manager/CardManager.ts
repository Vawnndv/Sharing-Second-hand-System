import { Card } from '../Card/Card';
import pool from '../../config/DatabaseConfig';
import { QueryResult } from 'pg';

export class CardManager {

  public constructor() {

  }

  public viewListCard(warehouseID: string): Card[] {
    // code here
    return [];
  }

  public viewCardDetails(cardID: string): Card {
    // code here
    return new Card('');
  }

  public editCard(cardID: string): boolean {
    // code here
    return true;
  }

  public static async createCardInput (qrcode: string, warehouseid: string, usergiveid: string, itemid: string): Promise<boolean> {

    const client = await pool.connect();
    const query = `
      INSERT INTO inputcard (time, qrcode, warehouseid, usergiveid, itemid)
      VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4);
      `;
    const values : any = [qrcode, warehouseid, usergiveid, itemid];
    
    try {
      const result: QueryResult = await client.query(query, values);
      console.log('Card input inserted successfully');
      return true;
    } catch (error) {
      console.error('Error inserting product:', error);
      return false;
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };
}