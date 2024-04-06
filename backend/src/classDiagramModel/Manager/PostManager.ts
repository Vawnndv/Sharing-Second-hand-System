import { Post } from '../Post';
import pool from '../../config/DatabaseConfig';
import { QueryResult } from 'pg';

export class PostManager {
  public constructor() {

  }

  public viewPost(): Post[] {
    // code here
    return [];
  }

  public static async viewDetailsPost(postID: number): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM posts WHERE postid = $1;', [postID]);
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }


  public static async viewPostReceivers(postID: number): Promise<any[]> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT receiverid, postid, avatar, username, firstname, lastname, postreceiver.comment, postreceiver.time, give_receivetype FROM "User" JOIN postreceiver ON userid = receiverid JOIN give_receivetype ON receivertypeid = give_receivetypeid AND postid = $1;', [postID]);
      if (result.rows.length === 0) {
        return [];
      }
      console.log(result.rows);
      return result.rows;
      }
      catch (error) {
        console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
        throw error; // Ném lỗi để controller có thể xử lý
      } finally {
        client.release(); // Release client sau khi sử dụng
      }
    }


  public static async getDetailsPost(postID: number): Promise<Post | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM "posts" WHERE postid = $1`, [postID]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0]
      return new Post(row.postid, row.title, row.itemid, row.time, row.owner, row.description, row.location, row.timestart, row.timeend)
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }


  public static async createPost (title: string, location: string, description: string, owner: number, time: Date, itemid : number, timestart: Date, timeend: Date): Promise<void> {

    const client = await pool.connect();
    const query = `
        INSERT INTO posts(title, location, description, owner, time, itemid, timestart, timeend)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
    const values : any = [title, location, description, owner, time, itemid, timestart, timeend];
    
    try {
      const result: QueryResult = await client.query(query, values);
      console.log('Posts inserted successfully:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting product:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };


  public viewPostsOfUser(userID: string): Post[] {
    // code here
    return [];
  }

  public searchPost(stringSearch: string): Post[] {
    // code here
    return [];
  }

  public addPost(): boolean {
    // code here
    return true;
  }

  public editPost(): boolean {
    // code here
    return true;
  }

  public confirmReceive(postID: string): boolean {
    // code here
    return true;
  }

  public likePost(): void {
    // code here
  }
}