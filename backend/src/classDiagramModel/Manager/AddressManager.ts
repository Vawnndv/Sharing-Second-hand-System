import { Address } from '../Address';
import pool from '../../config/DatabaseConfig';
import { QueryResult } from 'pg';
import { fail } from 'assert';


export class AddressManager {
  public constructor() {

  }

  public viewAddress(): Address[] {
    // code here
    return [];
  }

  
  public async updateAddress(addressid: number, address: string, longitude: number, latitude: number ): Promise<void> {

    const client = await pool.connect();
    const query = `
        UPDATE ADDRESS
        SET address = '${address}', longitude = ${longitude}, latitude = ${latitude}
        WHERE addressid = ${addressid}
        RETURNING *
      `;
    // const values : any = [postid, receiverid, comment, time, receivertypeid, warehouseid];
    
    try {
      const result: QueryResult = await client.query(query);
      console.log('Address updated successfully:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Error whien updating Address:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

}