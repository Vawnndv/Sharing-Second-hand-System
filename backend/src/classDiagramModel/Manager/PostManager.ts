import { Post } from '../Post';
import pool from '../../config/DatabaseConfig';
import { QueryResult } from 'pg';
import { fail } from 'assert';
import { WarehouseManager } from './WarehouseManager';

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

interface Address {
  longitude: string;
  latitude: string;
}


function filterSearch(distance: string, time: string, category: string[], warehouseList: Address[], sort: string, latitude: string, longitude: string, isFilterWarehouse: boolean, data: FilterSearch[]): FilterSearch[] {
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

  function isCoordinateInWarehouseList(lon1: string, lat1: string, warehouseList: Address[]): boolean {
    // Duyệt qua mỗi phần tử trong mảng warehouseList
    for (const address of warehouseList) {
      // So sánh longitude và latitude với lon1 và lat1
      if (address.longitude === lon1 && address.latitude === lat1) {
        // Nếu tìm thấy, trả về true
        return true;
      }
    }
    // Nếu không tìm thấy, trả về false
    return false;
  }

  // Lọc dữ liệu
  const filteredData: FilterSearch[] = data.filter(item => {

      let isValidDistance: boolean = true;
      // Lọc theo khoảng cách
      if (distanceFloat !== -1) {
        const distanceToGiver: number = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(item.latitude), parseFloat(item.longitude));
        isValidDistance =  distanceToGiver <= distanceFloat;
      }
      // Lọc theo thời gian
      const isValidTime: boolean = timeInt !== -1 ? isTimeBefore(item.createdat, timeInt) : true;

      // Lọc theo danh mục
      let isValidCategory: boolean = category.includes(item.nametype) || category.includes("Tất cả");

      let isValidWarehouse: boolean = isCoordinateInWarehouseList(item.longitude, item.latitude, warehouseList) || !isFilterWarehouse;

      // Kết hợp tất cả các điều kiện
      return isValidDistance && isValidTime && isValidCategory && isValidWarehouse;
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

  public async getListAddressByWarehouseID(warehouses: string[]): Promise<any> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT *
        FROM warehouse wh
        LEFT JOIN address ad ON ad.addressid = wh.addressid
        {placeholder}
      `;
      let constraints = 'WHERE ';
      if (warehouses.length == 0)
        constraints= '';
      for (let i = 0; i < warehouses.length; i++) {
        if (i == warehouses.length - 1)
          constraints = constraints + `wh.warehouseid = ${warehouses[i]} `
        else
          constraints = constraints + `wh.warehouseid = ${warehouses[i]} OR `
      }

      const result: QueryResult = await client.query(query.replace('{placeholder}', constraints));

      return result.rows; 
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }

  public async getAllPostsFromUserPost(limit: string, page: string, distance: string, time: string, category: string[], sort: string, latitude: string, longitude: string, warehouses: string[]): Promise<any> {
    const client = await pool.connect();
    try {

      const postsQuery = `
      SELECT DISTINCT
        us.userid,
        po.iswarehousepost,
        CASE WHEN po.iswarehousepost = true THEN wh.warehousename ELSE CONCAT(us.firstname, ' ', us.lastname) END AS name,
        CASE WHEN po.iswarehousepost = true THEN '' ELSE us.avatar END AS avatar,
        po.postid,
        po.title,
        po.description,
        po.createdat,
        ad.address,
        ad.longitude,
        ad.latitude,
        img.path,
        itt.nametype,
        od.status,
        us.firstname,
        us.lastname,
        CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
        CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count
      FROM Posts AS po
      LEFT JOIN "User" us ON po.owner = us.UserID
      LEFT JOIN "postreceiver" pr ON po.postid = pr.postid
      LEFT JOIN Address ad ON po.addressid = ad.addressid
      LEFT JOIN item it ON it.itemid = po.itemid
      LEFT JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
      LEFT JOIN "like_post" lp ON po.postid = lp.postid
      LEFT JOIN warehouse wh ON ad.addressid = wh.addressid
      LEFT JOIN orders od ON od.postid = po.postid
      LEFT JOIN (
          SELECT DISTINCT ON (itemid) * FROM Image
      ) img ON img.itemid = po.itemid
      WHERE po.iswarehousepost = false AND po.givetypeid != 3 AND po.givetypeid != 4 AND (po.statusid = 12)
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
          wh.warehousename,
          itt.nametype,
          od.status,
          us.firstname,
          us.lastname
      ORDER BY po.createdat DESC
      LIMIT ${limit}
      OFFSET ${limit} * ${page};
      `;
      const result: QueryResult = await client.query(postsQuery);
      if (result.rows.length === 0) {
        return null;
      }

      const warehouseList = await this.getListAddressByWarehouseID(warehouses);

      return filterSearch(distance, time, category, warehouseList, sort, latitude, longitude, false, result.rows); 
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }
  

  public async getAllPostFromWarehouse(limit: string, page: string, distance: string, time: string, category: string[], sort: string, latitude: string, longitude: string,  warehouses: string[]): Promise<any> {
    const client = await pool.connect();
    try {

      const postsQuery = `
      SELECT DISTINCT
        us.userid,
        po.iswarehousepost,
        CASE WHEN po.iswarehousepost = 'true' THEN wh.warehousename END AS name,
        CASE WHEN po.iswarehousepost = 'true' THEN '' ELSE us.avatar END AS avatar,
        po.postid,
        po.title,
        po.description,
        po.createdat,
        ad.address,
        ad.longitude,
        ad.latitude,
		    wh.warehousename,
        img.path,
        itt.nametype,
        od.status,
        us.firstname,
		    us.lastname,
        CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
        CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count
      FROM Posts AS po
      LEFT JOIN "User" us ON po.owner = us.UserID
      LEFT JOIN Address ad ON po.addressid = ad.addressid
      LEFT JOIN "postreceiver" pr ON po.postid = pr.postid
      LEFT JOIN item it ON it.itemid = po.itemid
      LEFT JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
      LEFT JOIN "like_post" lp ON po.postid = lp.postid
      LEFT JOIN warehouse wh ON po.warehouseid = wh.warehouseid
      LEFT JOIN orders od ON od.postid = po.postid
      LEFT JOIN (
          SELECT DISTINCT ON (itemid) * FROM Image
      ) img ON img.itemid = po.itemid
      WHERE po.iswarehousepost = true AND po.givetypeid != 3 AND po.givetypeid != 4 
	    AND (po.statusid = 12)
      AND wh.isactivated = true
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
          wh.warehousename,
          itt.nametype,
          od.status,
          us.firstname,
		      us.lastname
      ORDER BY po.createdat DESC
      LIMIT ${limit}
      OFFSET ${limit} * ${page};
      `;

      const result: QueryResult = await client.query(postsQuery);
      if (result.rows.length === 0) {
        return null;
      }

      const warehouseList = await this.getListAddressByWarehouseID(warehouses);

      return filterSearch(distance, time, category, warehouseList, sort, latitude, longitude, true, result.rows); 
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }



  public async getUserLikePosts(limit: string, page: string,userId: string): Promise<any> {
    const client = await pool.connect();
    try {
      const postsQuery = `
          SELECT  
            p.description, 
            p.postid,
            p.itemid,
            p.updatedat, 
            p.createdat,
            COALESCE(u.avatar, w.avatar) AS avatar,
            COALESCE(CONCAT(u.firstname, ' ', u.lastname), w.warehousename) AS name,
            a.address,
            a.longitude,
            a.latitude,
            itt.nametype,
            MIN(i.path) AS path,
            CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
            CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count,
            MAX(lp.createdat) AS max_like_createdat
        FROM 
            "posts" p
        LEFT JOIN 
            "User" u ON u.userid = p.owner AND u.userid NOT IN (SELECT userid FROM workAt)
        LEFT JOIN 
            "workat" wa ON p.owner = wa.userid
        LEFT JOIN 
            "warehouse" w ON wa.warehouseid = w.warehouseid
        JOIN 
            "address" a ON a.addressid = p.addressid
        JOIN 
            item it ON it.itemid = p.itemid
        JOIN 
            item_type itt ON itt.itemtypeid = it.itemtypeid
        LEFT JOIN 
            "image" i ON p.itemid = i.itemid
        LEFT JOIN
            "postreceiver" pr ON p.postid = pr.postid
        LEFT JOIN 
            "like_post" lp ON p.postid = lp.postid
        WHERE 
            (u.userId IS NOT NULL OR w.warehouseid IS NOT NULL) 
            AND p.postid IN (SELECT postid FROM "like_post" WHERE userid = ${userId})
        GROUP BY 
            p.description, 
            p.postid,
            p.itemid,
            p.updatedat, 
            p.createdat,
            COALESCE(u.avatar, w.avatar),
            COALESCE(CONCAT(u.firstname, ' ', u.lastname), w.warehousename),
            a.address,
            a.longitude,
            a.latitude,
            itt.nametype
        ORDER BY
            max_like_createdat DESC
        LIMIT ${limit}
        OFFSET ${limit} * ${page};
      `;

      const result: QueryResult = await client.query(postsQuery);
      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }
  

  public async getReceivePosts(limit: string, page: string,userId: string): Promise<any> {
    const client = await pool.connect();
    try {
      const postsQuery = `
        SELECT  
          p.description, 
          p.postid,
          p.itemid,
          p.updatedat, 
          p.createdat,
          COALESCE(u.avatar, w.avatar) AS avatar,
          COALESCE(CONCAT(u.firstname, ' ', u.lastname), w.warehousename) AS name,
          a.address,
          a.longitude,
          a.latitude,
          itt.nametype,
          MIN(i.path) AS path,
          CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
          CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count,
          MAX(lp.createdat) AS max_like_createdat
      FROM 
          "posts" p
      LEFT JOIN 
          "User" u ON u.userid = p.owner AND u.userid NOT IN (SELECT userid FROM workAt)
      LEFT JOIN 
          "workat" wa ON p.owner = wa.userid
      LEFT JOIN 
          "warehouse" w ON wa.warehouseid = w.warehouseid
      JOIN 
          "address" a ON a.addressid = p.addressid
      JOIN 
          item it ON it.itemid = p.itemid
      JOIN 
          item_type itt ON itt.itemtypeid = it.itemtypeid
      LEFT JOIN 
          "image" i ON p.itemid = i.itemid
      LEFT JOIN 
          "like_post" lp ON p.postid = lp.postid
      LEFT JOIN
          "postreceiver" pr ON p.postid = pr.postid
      WHERE 
          (u.userId IS NOT NULL OR w.warehouseid IS NOT NULL) 
		      AND p.postid IN (SELECT postid FROM "postreceiver" WHERE receiverid = ${userId})
      GROUP BY 
          p.description, 
          p.postid,
          p.itemid,
          p.updatedat, 
          p.createdat,
          COALESCE(u.avatar, w.avatar),
          COALESCE(CONCAT(u.firstname, ' ', u.lastname), w.warehousename),
          a.address,
          a.longitude,
          a.latitude,
          itt.nametype
      ORDER BY
        max_like_createdat DESC
        LIMIT ${limit}
        OFFSET ${limit} * ${page};
      `;

      const result: QueryResult = await client.query(postsQuery);
      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }

  public async viewDetailsPost(postID: number): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
      SELECT 
        POSTS.*,
        ITEM.name,
        ITEM_TYPE.nametype,
        ADDRESS.address,
        ADDRESS.longitude,
        ADDRESS.latitude,
        TRACE_STATUS.statusname,
        GIVE_RECEIVETYPE.give_receivetype
      FROM 
          POSTS
      INNER JOIN
          ITEM ON ITEM.itemid = POSTS.itemid
      INNER JOIN
          ITEM_TYPE ON ITEM.itemtypeid = ITEM_TYPE.itemtypeid
      INNER JOIN 
          ADDRESS ON POSTS.addressid = ADDRESS.addressid
      INNER JOIN
        TRACE_STATUS ON TRACE_STATUS.statusid = POSTS.statusid
      INNER JOIN
        GIVE_RECEIVETYPE ON GIVE_RECEIVETYPE.give_receivetypeid = POSTS.givetypeid
      WHERE 
          POSTS.postid = $1;`,[postID]);

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

  public async viewDetailsPostForUpdate(postID: number): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
      SELECT 
        *
      FROM 
          POSTS
      WHERE 
          POSTS.postid = $1
      FOR UPDATE`,[postID]);

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


  public async viewPostReceivers(postID: number): Promise<any[]> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT receiverid, receivertypeid, postid, avatar, firstname, lastname, postreceiver.comment, postreceiver.time, give_receivetype, warehouseid FROM "User" JOIN postreceiver ON userid = receiverid JOIN give_receivetype ON receivertypeid = give_receivetypeid AND postid = $1;', [postID]);
      if (result.rows.length === 0) {
        return [];
      }
      return result.rows;
      }
      catch (error) {
        console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
        throw error; // Ném lỗi để controller có thể xử lý
      } finally {
        client.release(); // Release client sau khi sử dụng
      }
    }


  public async getDetailsPost(postID: number): Promise<Post | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM posts WHERE postid = $1;', [postID]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0]
      return new Post(row.postid, row.title, row.itemid, row.time, row.owner, row.description, row.location, row.timestart, row.timeend, row.phonenumber)
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }

  


  public async createPost (title: string, location: string, description: string, owner: number, time: Date, 
    itemid : number, timestart: Date, timeend: Date, isNewAddress: string, postLocation: any, isWarehousePost: string, 
    statusid: number, givetypeid: number, warehouseid: number, phonenumber: string): Promise<void> {

    const client = await pool.connect();

    const queryInsertAddress = `
      INSERT INTO "address" (address, latitude, longitude) 
      VALUES ('${postLocation.address}', ${postLocation.latitude}, ${postLocation.longitude})
      RETURNING addressid;
    `

    const querySelectAllWarehouse = `        
    SELECT 
      w.warehouseid,
      w.addressid,
      w.warehousename,
      w.avatar,
      w.phonenumber,
      w.createdat,
      a.address,
      longitude,
      latitude
    FROM 
      Warehouse w
    INNER JOIN address a ON a.addressid = w.addressid `;

    const query = `
        INSERT INTO posts(title, location, description, owner, time, itemid, timestart, timeend, addressid, iswarehousepost, statusid, givetypeid, warehouseid, phonenumber)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *;
      `;
  
    
    try {
      let values : any = null;
      let warehouseSelected = null;

      if(!warehouseid){
        const allWarehouse : QueryResult = await client.query(querySelectAllWarehouse);
        let closestDistance = Infinity;

   

        for (let i = 0; i < allWarehouse.rows.length; i++) {
          const warehouse = allWarehouse.rows[i];
   
          const R = 6371; // Bán kính trái đất theo km
          const dLat = (warehouse.latitude - postLocation.latitude) * Math.PI / 180;
          const dLon = (warehouse.longitude - postLocation.longitude) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(postLocation.latitude * Math.PI / 180) * Math.cos(warehouse.latitude * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          
          if (distance < closestDistance) {
              closestDistance = distance;
              warehouseSelected = warehouse.warehouseid; // Giả sử warehouse có thuộc tính warehouseId
          }
        }
      }
      else{
        warehouseSelected = warehouseid;
      }
      if(isNewAddress){
        const resultInsertAddress: QueryResult = await client.query(queryInsertAddress);
        values = [title, location, description, owner, time, itemid, timestart, timeend, resultInsertAddress.rows[0].addressid, isWarehousePost, statusid, givetypeid, warehouseSelected, phonenumber];
      }else{
        values = [title, location, description, owner, time, itemid, timestart, timeend, postLocation.addressid, isWarehousePost, statusid, givetypeid, warehouseSelected, phonenumber];
      }
      const result: QueryResult = await client.query(query, values);
      return result.rows[0];
      
    } catch (error) {
      console.error('Error inserting post:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };


  public async createPostReceiver (postid: number, receiverid: number, comment: string, time: Date, 
    receivertypeid: number, warehouseid: number): Promise<void> {

    const client = await pool.connect();
    const query = `
        INSERT INTO POSTRECEIVER(postid, receiverid, comment, time, receivertypeid, warehouseid)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
    const values : any = [postid, receiverid, comment, time, receivertypeid, warehouseid];
    
    try {
      const result: QueryResult = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting post receiver:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };


  public async viewPostOwnerInfo(postID: number): Promise<Post | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
      SELECT owner, itemid, postid, p.addressid, title, firstname, lastname, p.phonenumber, timestart, timeend, iswarehousepost, a.address, a.longitude, a.latitude 
      FROM POSTS p
      INNER JOIN "User" u ON u.userid = p.owner 
      INNER JOIN ADDRESS a ON p.addressid = a.addressid WHERE p.postid = $1`, [postID]);
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


  public async updatePostDetail (postid: number, title: string, description: string, timestart: Date, timeend: Date ): Promise<void> {

    const client = await pool.connect();
    const query = `
        UPDATE POSTS
        SET title = '${title}', description = '${description}', timestart = '${timestart}', timeend = '${timeend}'
        WHERE postid = ${postid}
        RETURNING *
      `;
    // const values : any = [postid, receiverid, comment, time, receivertypeid, warehouseid];
    
    try {
      const result: QueryResult = await client.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error when updating post:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };








  public viewPostsOfUser(userID: string): Post[] {
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

  public async searchPost (keyword: string, limit: string, iswarehousepost:string, page: string, distance: string,
     time: string, category: string[], sort: string, latitude: string, longitude: string, warehouses: string[]): Promise<any> {
    const client = await pool.connect();
    let query = `
      SELECT DISTINCT
        us.userid,
        CASE WHEN po.iswarehousepost = true THEN wh.warehousename ELSE CONCAT(us.firstname, ' ', us.lastname) END AS name,
        CASE WHEN po.iswarehousepost = true THEN '' ELSE us.avatar END AS avatar,
        po.postid,
        po.title,
        po.description,
        po.createdat,
        ad.address,
        ad.longitude,
        ad.latitude,
        img.path,
        itt.nametype,
        CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
        CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count
      FROM Posts AS po
      LEFT JOIN "User" us ON po.owner = us.UserID
      LEFT JOIN Address ad ON po.addressid = ad.addressid
      LEFT JOIN "postreceiver" pr ON po.postid = pr.postid
      LEFT JOIN item it ON it.itemid = po.itemid
      LEFT JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
      LEFT JOIN "like_post" lp ON po.postid = lp.postid
      LEFT JOIN warehouse wh ON ad.addressid = wh.addressid
      LEFT JOIN (
          SELECT DISTINCT ON (itemid) * FROM Image
      ) img ON img.itemid = po.itemid
      WHERE (po.iswarehousepost = ${iswarehousepost}  AND po.givetypeid != 3 AND po.givetypeid != 4) AND (po.statusid = 12)
      AND (LOWER(po.title) LIKE LOWER('%${keyword}%') OR LOWER(po.description) LIKE LOWER('%${keyword}%'))
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
          wh.warehousename,
          itt.nametype
      ORDER BY po.createdat DESC
      LIMIT ${limit}
      OFFSET ${limit} * ${page};
      `;

    try {
      const result: QueryResult = await client.query(query);
      const warehouseList = await this.getListAddressByWarehouseID(warehouses);
      return filterSearch(distance, time, category, warehouseList, sort, latitude, longitude, Boolean(iswarehousepost), result.rows) 

    } catch (error) {
      console.error('Error: ', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public async deletePostReceivers(postID: string, receiverID: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
      DELETE FROM postreceiver
      WHERE postID = $1 AND receiverID = $2;`, [postID, receiverID]);

      return true;
      }
      catch (error) {
        console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
        return false;
        throw error; // Ném lỗi để controller có thể xử lý
      } finally {
        client.release(); // Release client sau khi sử dụng
      }
  }


  public async updatePostStatus (postid: number, statusid: number, isApproveAction: any) : Promise<any> {

    const client = await pool.connect();

    try{
      let query = ''
      if(!isApproveAction){
        query = `
        UPDATE posts
        SET statusid = ${statusid}
        WHERE postid = ${postid}
        RETURNING *
        `
      }
      else{
        query = `
        UPDATE posts
        SET statusid = ${statusid}, approvedate = NOW() 
        WHERE postid = ${postid}
        RETURNING *
        `
      }


      const resultQueryPost: QueryResult = await client.query(query)
      return resultQueryPost;
    }catch(error){
      console.log(error)
      return false
    }finally{
      client.release()
    }
  }

  public async getAllPostByUserId(userID: string[]): Promise<any> {
    const client = await pool.connect();
    try {
      let query = `
      SELECT
      po.postid,
      po.Title, 
      adg.address AS Location, 
      po.CreatedAt,
      (
        SELECT i.Path 
        FROM Image i 
        WHERE i.ItemID = po.ItemID 
        ORDER BY i.CreatedAt ASC -- Adjust this line based on how you determine the "first" image
        LIMIT 1
      ) AS Image, 
      ts.StatusName,
      adg.Longitude AS LongitudeGive,
      adg.Latitude AS LatitudeGive,
      itt.NameType,
      grt.Give_receivetype AS givetype
    FROM 
      Posts po
    LEFT JOIN 
      Address adg ON adg.AddressID = po.AddressID
    LEFT JOIN
      Item it ON it.ItemID = po.ItemID
    LEFT JOIN 
      Item_Type itt ON itt.ItemTypeID = it.ItemTypeID
    LEFT JOIN 
      Trace_Status ts ON po.StatusID = ts.StatusID
    LEFT JOIN
      Give_receivetype grt ON grt.give_receivetypeid = po.givetypeid
    WHERE 
      po.owner = $1
    ORDER BY
      po.CreatedAt DESC;
      `
      const result: QueryResult = await client.query(query, [userID]);
      return result.rows; 
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  public async getAmountUserLikePost(postID: string): Promise<any> {
    const client = await pool.connect();
    try {
      let query = `
      SELECT COUNT(*) AS amount
      FROM "like_post"
      WHERE postid = ${postID}
      `
      const result: QueryResult = await client.query(query);
      return result.rows[0].amount; 
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error;
    } finally {
      client.release();
    }
  }

}