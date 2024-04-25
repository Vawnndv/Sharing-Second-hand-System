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

  public static async createNewChat (firstuserid: string, seconduserid: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      INSERT INTO Chats (FirstUserID, SecondUserID, ChatStarted)
      VALUES ($1, $2, CURRENT_TIMESTAMP);
    `
    try {
      const result: QueryResult = await client.query(query, [firstuserid, seconduserid]);
      console.log('Create new chat success');
      return true
    } catch (error) {
      console.error('Error create new chat:', error);
      return false
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async getUserChatList (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT DISTINCT
        "User".avatar,
        "User".userid,
        "User".username,
        "User".firstname,
        "User".lastname,
        "User".phonenumber
      FROM
          Chats
          JOIN "User" ON ("User".userID = CASE
              WHEN Chats.FirstUserID = $1 THEN Chats.SecondUserID
              WHEN Chats.SecondUserID = $1 THEN Chats.FirstUserID
          END)
      WHERE
          Chats.FirstUserID = $1 OR Chats.SecondUserID = $1;
    `
    
    try {
      const result: QueryResult = await client.query(query, [userID]);
      console.log('Get users list success:', result.rows);
      return result.rows
    } catch (error) {
      console.error('Error get users chat:', error);
      return false
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };
}