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

  public async createCardInput (qrcode: string, warehouseid: number, usergiveid: number, orderid: number, itemid: number): Promise<boolean> {

    const client = await pool.connect();
    const query = `
      INSERT INTO inputcard (time, qrcode, warehouseid, usergiveid, orderid, itemid)
      VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4, $5)
      RETURNING *;
      `;
    const values : any = [qrcode, warehouseid, usergiveid, orderid, itemid];
    
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

  public async createCardOutput (warehouseid: number, userreceiveid: number, orderid: number, itemid: number): Promise<boolean> {

    const client = await pool.connect();
    const query = `
      INSERT INTO outputcard (time, warehouseid, userreceiveid, orderid, itemid)
      VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4)
      RETURNING *;
      `;
    const values : any = [warehouseid, userreceiveid, orderid, itemid];
    
    try {
      const result: QueryResult = await client.query(query, values);
      console.log('Card output inserted successfully');
      return true;
    } catch (error) {
      console.error('Error inserting product:', error);
      return false;
    } finally {
      client.release(); // Release client sau khi sử dụng
      
    }
  };
}