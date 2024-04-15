import { Message } from '../Message';
import pool from "../../config/DatabaseConfig"
import { QueryResult } from 'pg';

export class ChatManager {
  public constructor() {

  }

  public sendMessage(message: Message): void {
    // code here
  }

  public showChatSegment(userId1: string, userId2: string): Message[] {
    // code here        
    return [];
  }

  public static async getUserChatList (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT userid, username, firstname, lastname, phonenumber, avatar
      FROM public."User"
    `
    
    try {
      const result: QueryResult = await client.query(query);
      console.log('Get users list success:', result.rows);
      return result.rows
    } catch (error) {
      console.error('Error get orders:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };
}