import { User } from '../User';
import pool from '../../config/DatabaseConfig'
import { QueryResult } from 'pg';

export class UserManager {
  public constructor() {

  }

  public static async getUser(userID: string): Promise<User | undefined>{
    const client = await pool.connect();
    try{
      const query = `
        SELECT * FROM "User" WHERE userid = $1
      `

      const values: any = [userID]

      const userResult : QueryResult = await client.query(query, values)
      const user = userResult.rows[0]
      if(user){
        return new User(
          user.userid,
          user.roleid,
          user.dateofbirth,
          user.avatar,
          user.email,
          user.phonenumber,
          user.lastname,
          user.firstname,
          user.address,
          user.username,
          user.password
        )
      }else{
        return undefined;
      }
      
    }catch(error){
      console.log(error)
      return undefined;
    }finally{
      client.release()
    }

  }

  public static async getUserAddress(userID: string): Promise<any> {
    const client = await pool.connect()

    const query = `
      SELECT a.addressid, a.address, a.latitude, a.longitude
      FROM "User" u
      INNER JOIN "address" a 
      ON a.addressid = u.addressid
      WHERE u.userid = ${userID}
      `

    try {
      const result = await client.query(query);
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

  public static async getAllUsers(page: string, pageSize: string, whereClause: string, orderByClause: string): Promise<any> {
    const client = await pool.connect()

    const query = `SELECT 
    u.userid,
    u.dateofbirth AS dob, 
    u.email, 
    u.firstname, 
    u.lastname,
    u.phonenumber, 
    u.avatar,
    u.dateofbirth, 
    u.addressid, 
    u.createdat, 
    u.updatedat, 
    u.isbanned,
    a.address,
    a.longitude,
    a.latitude
    FROM public."User" u LEFT JOIN address a ON u.addressid 
    = a.addressid WHERE u.roleid = 1 AND u.email is not null` + whereClause + orderByClause + ` LIMIT ${pageSize} OFFSET ${page} * ${pageSize}`;


    try {
      const result = await client.query(query);
      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
      
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  public static async totalAllUser(whereClause: string): Promise<any> {
    const client = await pool.connect()
    const query = 
    // 'SELECT COUNT(*) FROM users' + whereClause;
      `SELECT COUNT(*)::INTEGER AS total_users
      FROM public."User" u
      WHERE u.roleid = 1 AND u.email is not null` + whereClause;

    try {
      const result = await client.query(query);
      if (result.rows.length === 0) {
        return {total_users: 0};
      }

      return result.rows[0];
      
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }


  
  public static async totalGiveAndReceiveOrder(userid: string): Promise<any> {
    const client = await pool.connect()
    const query = 
      `SELECT
      (SELECT COUNT(*) FROM ORDERS WHERE usergiveid = ${userid} AND status LIKE 'Hoàn tất') AS GiveCount,
      (SELECT COUNT(*) FROM ORDERS WHERE userreceiveid = ${userid} AND status LIKE 'Hoàn tất') AS ReceiveCount`;

    try {
      const result = await client.query(query);
      return result.rows[0];
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  public static async adminBanUser(userid: number, isBanned: boolean): Promise<any> {
    const client = await pool.connect();
    const query = `
      UPDATE "User"
      SET isbanned = $2
      WHERE userid = $1
    `;
    const values: any = [userid, isBanned];
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


  public static async adminDeleteUser(userid: string): Promise<any> {
    const client = await pool.connect();


    const query = `
      UPDATE "User"
      SET email = null, password = ''
      WHERE userid = $1
    `;
    const values: any = [userid];
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

  
  public static async addFcmTokenToUser(userid: string, fcmtoken: string): Promise<any> {
    const client = await pool.connect();
    const query = `
        INSERT INTO fcmtoken(userid, fcmtoken) 
        VALUES($1, $2)
        RETURNING *;
      `;
    const values : any = [userid, fcmtoken];
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

  public static async removeFcmTokenToUser(userid: string, fcmtoken: string): Promise<any> {
    
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM "fcmtoken" WHERE userid = $1 AND fcmtoken = $2', [userid, fcmtoken]);

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
  };



  public ban(userID: string): void {
    //code here
  }

  public lock(userID: string): void {
    //code here
  }

  public viewProfile(userID: string): void {
    //code here
  }

  public editUser(userID: string): void {
    //code here
  }
}