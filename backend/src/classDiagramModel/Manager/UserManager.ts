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