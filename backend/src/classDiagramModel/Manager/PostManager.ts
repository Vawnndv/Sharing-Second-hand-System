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
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (error) {
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
      console.log(result.rows[0]);
      const row = result.rows[0]
      return new Post(row.postid, row.title, row.itemid, row.time, row.owner, row.description, row.location, row.timestart, row.timeend)
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }

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