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