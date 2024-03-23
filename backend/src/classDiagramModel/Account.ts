import { ChatManager } from './Manager/ChatManager';
import { NotiManager } from './Manager/NotiManager';
import pool from '../config/DatabaseConfig';
import { QueryResult } from 'pg';

export class Account {
  protected userID: string | undefined;

  protected roleID: string | undefined;

  protected dateOfBirth: string | undefined;

  protected avatar: string | undefined;

  protected email: string | undefined;

  protected phoneNumber: string | undefined;

  protected lastName: string | undefined;

  protected firstName: string | undefined;

  protected username: string | undefined;

  protected password: string | undefined;

  protected notiManager: NotiManager | undefined;

  protected chat: ChatManager | undefined;

  public constructor(userID: string) {
    this.userID = userID;
  }

  public editProfile(): void {
    // code here
  }

  
  public static async createItem(username: string, email: string, password: string, roleid: number): Promise<any> {
    const client = await pool.connect();
    const query = `
        INSERT INTO User(username, email, password, roleid) 
        VALUES($1, $2, $3, $4)
        RETURNING *
      `;
    const values : any = [username, email, password, roleid];
    try {
      const result: QueryResult = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } 
  };

  public static async findUserByEmail(email: string): Promise<any> {
    const client = await pool.connect();
    const query = `SELECT * FROM user WHERE email = $1`;
    const values : any = [email];
    try {
      console.log(email)
      const result: QueryResult = await client.query(query, values);
      console.log(result.rows[0])
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null
    } 
  }
}