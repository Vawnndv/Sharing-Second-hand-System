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

  protected address: string | undefined;

  protected username: string | undefined;

  protected password: string | undefined;

  protected notiManager: NotiManager | undefined;

  protected chat: ChatManager | undefined;

  public constructor(userID: string, roleID: string, dateOfBirth: string, avatar: string,
    email: string, phoneNumber: string, lastName: string, firstName: string, address: string, username: string,
    password: string) {
    this.userID = userID;
    this.roleID = roleID;
    this.dateOfBirth = dateOfBirth;
    this.avatar = avatar;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.lastName = lastName;
    this.firstName = firstName;
    this.address = address;
    this.username = username;
    this.password = password;
  }

  public editProfile(): void {
    // code here
  }

  
  public static async createItem(username: string, email: string, password: string, roleid: number): Promise<any> {
    const client = await pool.connect();
    const query = `
        INSERT INTO "User"(username, email, password, roleid) 
        VALUES($1, $2, $3, $4)
        RETURNING *;
      `;
    const values : any = [username, email, password, roleid];
    try {
      const result = await client.query(query, values);
      console.log('User inserted successfully:', result.rows[0]);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } 
  };

  public static async findUserById(userId: string): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM "User" WHERE userid = $1', [userId]);
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
      // return new Item(row.itemId, row.name, row.quantity);
    } catch(error) {
      console.log(error);
      return null;
    }
  }

  public static async findUserByEmail(email: string): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM "User" WHERE email like $1', [email]);
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
      // return new Item(row.itemId, row.name, row.quantity);
    } catch(error) {
      console.log(error);
      return null;
    }
  }

  public static async updateAccount(userid: number, username: string, password: string, phonenumber: string, avatar: string): Promise<any> {
    const client = await pool.connect();
    const query = `
      UPDATE "User"
      SET username = $1, password = $2, phonenumber = $3, avatar = $4
      WHERE userid = $5
      RETURNING *;
    `;
    const values: any = [username,  password, phonenumber, avatar, userid];
    try {
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } 
  };

  public static async updateAccountPassword(userid: number, password: string): Promise<any> {
    const client = await pool.connect();
    const query = `
      UPDATE "User"
      SET password = $2
      WHERE userid = $1
      RETURNING *;
    `;
    const values: any = [userid, password];
    try {
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    };
  }; 
}
