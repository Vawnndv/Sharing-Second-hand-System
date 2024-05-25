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

  public static async createNewChat (firstuserid: string, seconduserid: string, postid: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      INSERT INTO Chats (FirstUserID, SecondUserID, ChatStarted, postid)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3);
    `
    try {
      const result: QueryResult = await client.query(query, [firstuserid, seconduserid, postid]);
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
      "User".firstname,
      "User".lastname,
      "User".phonenumber,
      po.title,
      po.postid,
      CASE
  --         WHEN od.usergiveid IS NOT NULL AND od.userreceiveid IS NOT NULL AND od.status = 'Hoàn tất' THEN 'false'
          WHEN od.usergiveid IS NOT NULL AND od.userreceiveid IS NOT NULL AND od.status <> 'Hoàn tất' THEN 'true'
          WHEN od.userreceiveid IS NULL AND od.status != 'Đã duyệt' THEN 'true'
  -- 		WHEN od.userreceiveid IS NULL AND od.status == 'Đã duyệt' THEN 'true'
          ELSE 'false'
      END AS enableChat
  FROM
      Chats
  JOIN "User" ON ("User".userID = CASE
      WHEN Chats.FirstUserID = $1 THEN Chats.SecondUserID
      WHEN Chats.SecondUserID = $1 THEN Chats.FirstUserID
  END)
  LEFT JOIN Posts po ON Chats.postid = po.postid
  LEFT JOIN Orders od ON od.postid = Chats.postid
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

  public static async getUserChatListUser (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT DISTINCT
        "User".avatar,
        "User".userid,
        "User".firstname,
        "User".lastname,
        "User".phonenumber
      FROM
          ChatUsers
          JOIN "User" ON ("User".userID = CASE
              WHEN ChatUsers.FirstUserID = $1 THEN ChatUsers.SecondUserID
              WHEN ChatUsers.SecondUserID = $1 THEN ChatUsers.FirstUserID
          END)
      WHERE
        ChatUsers.FirstUserID = $1 OR ChatUsers.SecondUserID = $1;
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

  public static async getChatListCollaborator (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT u.*
      FROM Workat w
      JOIN "User" u ON w.userid = u.userid
      WHERE w.warehouseid = (
          SELECT warehouseid
          FROM Workat
          WHERE userid = $1
      );
    `
    try {
      const result: QueryResult = await client.query(query, [userID]);
      return result.rows
    } catch (error) {
      console.error('Error get users chat:', error);
      return false
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async getChatListUser (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT u.*
      FROM "User" u
      WHERE 
      u.addressid = (
          SELECT addressid
          FROM warehouse w
          WHERE w.warehouseid = (
              SELECT warehouseid
              FROM Workat
              WHERE userid = $1
          )
      ) AND u.roleid = 1;
    `
    try {
      const result: QueryResult = await client.query(query, [userID]);
      return result.rows
    } catch (error) {
      console.error('Error get users chat:', error);
      return false
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async getChatWarehouse (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT warehouseid
      FROM Workat
      WHERE userid = $1
    `
    try {
      const result: QueryResult = await client.query(query, [userID]);
      return result.rows
    } catch (error) {
      console.error('Error get users chat:', error);
      return false
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async createNewChatUser (firstuserid: string, seconduserid: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      INSERT INTO Chatusers (FirstUserID, SecondUserID, ChatStarted)
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

  public static async getWareHouseByUserID (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT w.*
      FROM Warehouse w
      WHERE 
      w.warehouseid IN (
        SELECT warehouseid
        FROM Workat
        WHERE userid = $1
      );
    `
    try {
      const result: QueryResult = await client.query(query, [userID]);
      return result.rows
    } catch (error) {
      console.error('Error get users chat:', error);
      return false
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };
}