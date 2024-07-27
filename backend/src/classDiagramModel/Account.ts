import { Collaborator } from './Collaborator';
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

  public static notiManager: NotiManager = new NotiManager();

  public static chatManager: ChatManager = new ChatManager();

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

  }

  
  public static async createItem(email: string, firstname: string, lastname: string, password: string, avatar: string, roleid: number): Promise<any> {
    const client = await pool.connect();
    const query = `
        INSERT INTO "User"(firstname, lastname, email, password, avatar, roleid) 
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
    const values : any = [firstname, lastname, email, password, avatar, roleid];
    try {
      const result = await client.query(query, values);
      console.log('User inserted successfully:', result.rows[0]);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
    }
  };

  public static async createCollaborator(username: string, firstname: string, lastname: string, email: string, password: string, phonenumber: string, dob: string, roleid: number): Promise<any> {
    const client = await pool.connect();
    const query = `
        INSERT INTO "User"(firstname, lastname, email, password, phonenumber, roleid, dateofbirth) 
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
    const values : any = [firstname, lastname, email, password, phonenumber, roleid, dob];
    try {
      const result = await client.query(query, values);
      console.log('Collaborator inserted successfully:', result.rows[0]);

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
    }
  };

  public static async findUserById(userId: string): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT *, a.address FROM "User" u LEFT JOIN address a ON u.addressid = a.addressid WHERE u.userid = $1', [userId]);
      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      delete user.password; // Loại bỏ thuộc tính password
  
      return user;
    } catch(error) {
      console.log(error);
      return null;
  } finally {
      client.release();
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
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  public static async updateAccountProfile(userid: number, firstname: string, lastname: string, phonenumber: string, avatar: string, dob: string): Promise<any> {
    const client = await pool.connect();
    const query = `
      UPDATE "User"
      SET firstname = $2, lastname = $3, phonenumber = $4, avatar = $5, dateofbirth = $6
      WHERE userid = $1
      RETURNING *;
    `;
    const values: any = [userid, firstname, lastname, phonenumber, avatar, dob];
    try {
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
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
    } finally {
      client.release();
    }
  };

  public static async findUserLikePostsById(userId: string): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT postid FROM "like_post" WHERE userid = $1', [userId]);
      if (result.rows.length === 0) {
        return null;
      }
  
      return result.rows.map(row => row.postid);
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  public static async findUserPostReceivesById(userId: string): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT postid FROM "postreceiver" WHERE receiverid = $1', [userId]);
      if (result.rows.length === 0) {
        return null;
      }
  
      return result.rows.map(row => row.postid);
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  public static async setUserLikePostsById(userId: string, postid: string): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query('INSERT INTO "like_post" (userid, postid) VALUES ($1, $2)', [userId, postid]);

      if (result.rows.length === 0) {
        return null;
      }
  
      return result.rows[0];
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  public static async deleteUserLikePostsById(userId: string, postid: string): Promise<any> {

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM "like_post" WHERE userid = $1 AND postid = $2', [userId, postid]);

      if (result.rows.length === 0) {
        return null;
      }
  
      return result.rows[0];
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  public static async getFcmTokenListOfUser(userid: string): Promise<any> {
    const client = await pool.connect();
    const query = `
        SELECT fcmtoken FROM fcmtoken WHERE userid = $1;
      `;
    const values : any = [userid];
    try {
      const result = await client.query(query, values);
      return result.rows.map(row => row.fcmtoken);
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
    }
  };
}

