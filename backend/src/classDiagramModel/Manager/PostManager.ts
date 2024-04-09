import { Post } from '../Post';
import pool from '../../config/DatabaseConfig';
import { QueryResult } from 'pg';

interface FilterSearch {
  userid: string;
  firstname: string;
  lastname: string;
  avatar: Date;
  postid: number;
  title: string;
  description: string;
  createdat: Date;
  address: string;
  longitude: string;
  latitude: string;
  path: string;
  nametype: string;
}

function filterSearch(distance: string, time: string, category: string, sort: string, latitude: string, longitude: string, data: FilterSearch[]): FilterSearch[] {
  // Chuyển các tham số string sang số
  const distanceFloat: number = parseFloat(distance);
  const timeInt: number = parseInt(time);
  
  // Lấy thời gian hiện tại
  const currentTime: Date = new Date();

  // Hàm tính khoảng cách giữa 2 điểm trên bản đồ dựa vào tọa độ
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R: number = 6371; // Bán kính Trái Đất trong km
      const dLat: number = (lat2 - lat1) * Math.PI / 180; // Đổi độ sang radian
      const dLon: number = (lon2 - lon1) * Math.PI / 180;
      const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d: number = R * c; // Khoảng cách giữa 2 điểm
      return d;
  }

  // Hàm so sánh thời gian
  function isTimeBefore(itemTime: Date, limitTime: number): boolean {
      return itemTime.getTime() >= (currentTime.getTime() - (limitTime * 24 * 60 * 60 * 1000));
  }

  // Lọc dữ liệu
  const filteredData: FilterSearch[] = data.filter(item => {
      // Lọc theo khoảng cách
      let isValidDistance: boolean = false;
      const distanceToGiver: number = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(item.latitude), parseFloat(item.longitude));
      isValidDistance = distanceToGiver <= distanceFloat;

      // Lọc theo thời gian
      const isValidTime: boolean = isTimeBefore(item.createdat, timeInt);

      // Lọc theo danh mục
      let isValidCategory: boolean = item.nametype === category;
      if (category === "Tất cả") {
        isValidCategory = true
      }

      // Kết hợp tất cả các điều kiện
      return isValidDistance && isValidTime && isValidCategory;
  });

  // Sắp xếp dữ liệu nếu cần
  if (sort === "Mới nhất") {
      filteredData.sort((a, b) => b.createdat.getTime() - a.createdat.getTime());
  } else if (sort === "Gần nhất") {
      filteredData.sort((a, b) => {
          let distanceA, distanceB;
          distanceA = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(a.latitude), parseFloat(a.longitude));
          distanceB = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(b.latitude), parseFloat(b.longitude));
          return distanceA - distanceB;
      });
  }

  return filteredData;
}

export class PostManager {
  public constructor() {

  }

  public viewPost(): Post[] {
    // code here
    return [];
  }

  public static async getAllPostsFromUserPost( limit: string, page: string, distance: string, time: string, category: string, sort: string, latitude: string, longitude: string): Promise<any> {
    const client = await pool.connect();
    try {
      const postsQuery = `
      SELECT 
        u.avatar, 
        u.username, 
        u.firstname, 
        u.lastname, 
        p.description, 
        p.updatedat, 
        p.createdat,
        p.postid,
        a.address,
        itt.nametype,
        MIN(i.path) AS path,
        CAST(COUNT(lp.likeid) AS INTEGER) AS like_count
      FROM 
        "User" u
      RIGHT JOIN 
        "posts" p ON u.userId = p.owner
      JOIN 
        "address" a ON a.addressid = p.addressid
      JOIN 
        item it ON it.itemid = p.itemid
      JOIN item_type 
        itt ON itt.itemtypeid = it.itemtypeid
      LEFT JOIN 
        "image" i ON p.itemid = i.itemid
      LEFT JOIN 
        "like_post" lp ON p.postid = lp.postid
      WHERE 
        u.userId NOT IN (SELECT userId FROM workAt)
      GROUP BY 
        u.userId, 
        u.avatar, 
        u.username, 
        u.firstname, 
        u.lastname, 
        a.address,
        p.description, 
        p.updatedat, 
        p.createdat,
        p.postid,
        itt.nametype
      ORDER BY
        p.createdat DESC
      LIMIT ${limit}
      OFFSET ${limit} * ${page};
      `;
      let list: any[] = [];
      if (category === 'Tất cả' && sort === 'Mới nhất' && distance === '-1' && time === '-1') {
        console.log('hello')
        const result: QueryResult = await client.query(postsQuery);
        list = result.rows;
        console.log(list)
      } else {
        return filterSearch(distance, time, category, sort, latitude, longitude, list) 
      }

      if (list.length === 0) {
        return null;
      }
      return list;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }

  public static async getAllPostFromWarehouse(): Promise<any> {
    const client = await pool.connect();
    try {
      const postsQuery = `
        SELECT 
          p.description, 
          p.updatedat, 
          p.createdat,
          p.itemid,
          p.postid,
          w.warehousename,
          w.avatar,
          a.address,
          MIN(i.path) AS path,
          CAST(COUNT(lp.likeid) AS INTEGER) AS like_count
        FROM 
          "posts" p
        JOIN 
          "workat" wa
        ON 
          p.owner = wa.userid
        JOIN 
          "warehouse" w
        ON 
          wa.warehouseid = w.warehouseid
        JOIN 
          "address" a
        ON
          a.addressid = p.addressid
        LEFT JOIN 
          "image" i
        ON 
          p.itemid = i.itemid
        LEFT JOIN 
          "like_post" lp
        ON p.postid = lp.postid
        
        GROUP BY
          p.description, 
          p.updatedat, 
          p.createdat,
          p.itemid,
          p.postid,
          w.warehousename,
          a.address,
          w.avatar
        ORDER BY
          p.createdat DESC;  
      `;

      const result: QueryResult = await client.query(postsQuery);

      if (result.rows.length === 0) {
        return null;
      }
      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
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

  public static async searchPost (keyword: string, limit: string, iswarehousepost:string, page: string, distance: string, time: string, category: string, sort: string, latitude: string, longitude: string): Promise<any> {
    const client = await pool.connect();
    let query = `
    SELECT 
      us.userid,
      us.firstname,
      us.lastname,
      us.avatar,
      po.postid,
      po.title,
      po.description,
      po.createdat,
      ad.address,
      ad.longitude,
      ad.latitude,
      img.path,
      itt.nametype,
    COUNT(lp.likeid) AS like_count
      FROM Posts AS po
      JOIN "User" us ON po.owner = us.UserID
      JOIN Address ad ON po.addressid = ad.addressid
      JOIN item it ON it.itemid = po.itemid
      JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
      LEFT JOIN "like_post" lp ON po.postid = lp.postid
      LEFT JOIN Image img ON img.itemid = po.itemid
      WHERE po.iswarehousepost = ${iswarehousepost}
      AND (po.title LIKE '%$${keyword}%' OR po.description LIKE '%${keyword}%')
      GROUP BY
        us.userid,
        us.firstname,
        us.lastname,
        us.avatar,
        po.postid,
        po.title,
        po.description,
        po.createdat,
        ad.address,
        ad.longitude,
        ad.latitude,
        img.path,
        itt.nametype
      ORDER BY po.createdat DESC
      LIMIT ${limit}
      OFFSET ${limit} * ${page};
      `;
    
    try {
      const result: QueryResult = await client.query(query);
      return filterSearch(distance, time, category, sort, latitude, longitude, result.rows) 
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };
}