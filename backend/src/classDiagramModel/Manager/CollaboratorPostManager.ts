import { QueryResult } from 'pg';
import pool from '../../config/DatabaseConfig';
import { PostManager } from './PostManager';



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
export class CollaboratPostManager extends PostManager {
  public constructor() {
    super();
  }

  public approvePost(postID: string) : boolean {
    // code here
    return true;
  }
  

  public static async getTotalPost(status: string, userID: string): Promise<Number>{
    const client = await pool.connect();

    let query = ``
    if(status === 'userPost'){
      query = `
        SELECT COUNT (*) AS total_posts FROM (
          SELECT DISTINCT po.postid
          FROM Posts AS po
          WHERE po.iswarehousepost = false AND po.givetypeid != 3 AND po.givetypeid != 4 AND (po.statusid = 12)
        ) as Amount
      `
    }else if(status === 'warehousePost'){
      query = `
      SELECT COUNT (*) AS total_posts FROM (
        SELECT DISTINCT po.postid
        FROM Posts AS po
        WHERE po.iswarehousepost = false AND po.givetypeid != 3 AND po.givetypeid != 4 AND (po.statusid = 12)
      ) as Amount
      `
    }else if (status === 'waitForApprove'){
      query = `
      SELECT COUNT (*) AS total_posts FROM (
      SELECT DISTINCT po.postid
        FROM Posts AS po
      LEFT JOIN "User" us ON po.owner = us.UserID
      LEFT JOIN trace_status ts ON po.statusid = ts.statusid
        WHERE po.statusid = 2
        AND po.warehouseid = (
          SELECT warehouseid
            FROM "workat"
            WHERE userid = ${userID}
        )
    ) as Amount
      `
    }else if(status === 'justApprove'){
      query = `
      SELECT COUNT (*) AS total_posts FROM (
      SELECT DISTINCT po.postid
        FROM Posts AS po
      LEFT JOIN "User" us ON po.owner = us.UserID
      LEFT JOIN trace_status ts ON po.statusid = ts.statusid
        WHERE po.statusid = 12
        AND po.warehouseid = (
          SELECT warehouseid
            FROM "workat"
            WHERE userid = ${userID}
        )
      AND current_timestamp <= po.approvedate::timestamp + INTERVAL '1 day'
      AND current_timestamp >= po.approvedate::timestamp
    ) as Amount
      `
    }else if(status === 'justCancel'){
      query = `
      SELECT COUNT (*) AS total_posts FROM (
      SELECT DISTINCT po.postid
        FROM Posts AS po
      LEFT JOIN "User" us ON po.owner = us.UserID
      LEFT JOIN trace_status ts ON po.statusid = ts.statusid
        WHERE po.statusid = 6
        AND po.warehouseid = (
          SELECT warehouseid
            FROM "workat"
            WHERE userid = ${userID}
        )
      AND current_timestamp <= po.approvedate::timestamp + INTERVAL '1 day'
      AND current_timestamp >= po.approvedate::timestamp
    ) as Amount
      `
    }else if(status === 'received'){
      query = `
      SELECT COUNT (*) AS total_posts FROM (
        SELECT DISTINCT po.postid
        FROM Posts AS po
        LEFT JOIN "orders" od ON od.postid = po.postid
          WHERE po.iswarehousepost = true
          AND od.imgconfirmreceive = ' '
          AND po.warehouseid = (
            SELECT warehouseid
            FROM "workat"
            WHERE userid = ${userID}
          )) as Amount
      `
    }else if(status === 'given'){
      query = `
      SELECT COUNT (*) AS total_posts FROM (
        SELECT DISTINCT po.postid
        FROM Posts AS po
        LEFT JOIN "orders" od ON od.postid = po.postid
          WHERE po.iswarehousepost = true
          AND od.imgconfirmreceive != ' '
          AND po.warehouseid = (
            SELECT warehouseid
            FROM "workat"
            WHERE userid = ${userID}
          )) as Amount
      `
    }else{
      query = `
      SELECT COUNT (*) AS total_posts FROM (
      SELECT DISTINCT po.postid
        FROM Posts AS po
      LEFT JOIN "User" us ON po.owner = us.UserID
      LEFT JOIN "orders" od ON od.postid = po.postid
        WHERE (od.status LIKE 'Hàng đã nhập kho')
        AND po.warehouseid = (
          SELECT warehouseid
            FROM "workat"
            WHERE userid = ${userID}
        )
      AND (od.givetypeid=3 OR od.givetypeid=4 )
      AND (po.statusid = 14 OR po.statusid = 12)
    ) as Amount
      `
    }

    try {
      const result: QueryResult = await client.query(query)
      if(result.rows.length === 0){
        return 0
      }

      return result.rows[0].total_posts
    } catch (error) {
      console.log(error)
      return 0
    }finally {
      client.release(); // Release client sau khi sử dụng
    }
  }

  public static async getAllPostByStatus(status: string, limit: string, page: string, distance: string, time: string, category: string[], sort: string, latitude: string, longitude: string, warehouses: string[], userID: string): Promise<any> {
    const client = await pool.connect();
    try {
      let postsQuery = `
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
        ts.statusname,
        gr.give_receivetype,
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
      LEFT JOIN warehouse wh ON ad.addressid = wh.addressid
	  LEFT JOIN trace_status ts ON po.statusid = ts.statusid
      LEFT JOIN "give_receivetype" gr ON gr.give_receivetypeid = po.givetypeid
      LEFT JOIN (
          SELECT DISTINCT ON (itemid) * FROM Image
      ) img ON img.itemid = po.itemid

	  WHERE (ts.statusname LIKE '${status}')
    AND po.warehouseid = (
	  	SELECT warehouseid
      FROM "workat"
      WHERE userid = ${userID}
	  )
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
          ts.statusname,
          gr.give_receivetype,
          us.firstname,
		      us.lastname
      ORDER BY po.createdat DESC
      LIMIT ${limit}
      OFFSET ${limit} * ${page};
      `;

      if(status === 'Vừa duyệt'){
        postsQuery = `
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
          ts.statusname,
          gr.give_receivetype,
          us.firstname,
		      us.lastname,
      po.updatedat,
          CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
          CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count
        FROM Posts AS po
      LEFT JOIN "trace_status" ts ON po.statusid = ts.statusid
        LEFT JOIN "User" us ON po.owner = us.UserID
        LEFT JOIN Address ad ON po.addressid = ad.addressid
        LEFT JOIN "postreceiver" pr ON po.postid = pr.postid
        LEFT JOIN item it ON it.itemid = po.itemid
        LEFT JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
        LEFT JOIN "like_post" lp ON po.postid = lp.postid
        LEFT JOIN warehouse wh ON ad.addressid = wh.addressid
        LEFT JOIN "give_receivetype" gr ON gr.give_receivetypeid = po.givetypeid
        LEFT JOIN (
            SELECT DISTINCT ON (itemid) * FROM Image
        ) img ON img.itemid = po.itemid

        WHERE (ts.statusname LIKE 'Đã duyệt')
        AND po.warehouseid = (
          SELECT warehouseid
          FROM "workat"
          WHERE userid = ${userID}
        )
        AND current_timestamp <= po.approvedate::timestamp + INTERVAL '1 day'
        AND current_timestamp >= po.approvedate::timestamp
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
            gr.give_receivetype,
        ts.statusname,
        po.updatedat,
        us.firstname,
		    us.lastname
        ORDER BY po.createdat DESC
        LIMIT ${limit}
        OFFSET ${limit} * ${page};
          `
      }
      if(status === 'Vừa hủy'){
        postsQuery = `
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
          ts.statusname,
          gr.give_receivetype,
          po.updatedat,
          us.firstname,
          us.lastname,
          CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
          CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count
        FROM Posts AS po
      LEFT JOIN "trace_status" ts ON po.statusid = ts.statusid
        LEFT JOIN "User" us ON po.owner = us.UserID
        LEFT JOIN Address ad ON po.addressid = ad.addressid
        LEFT JOIN "postreceiver" pr ON po.postid = pr.postid
        LEFT JOIN item it ON it.itemid = po.itemid
        LEFT JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
        LEFT JOIN "like_post" lp ON po.postid = lp.postid
        LEFT JOIN warehouse wh ON ad.addressid = wh.addressid
        LEFT JOIN "give_receivetype" gr ON gr.give_receivetypeid = po.givetypeid
        LEFT JOIN (
            SELECT DISTINCT ON (itemid) * FROM Image
        ) img ON img.itemid = po.itemid

        WHERE (ts.statusname LIKE 'Đã hủy')
        AND po.warehouseid = (
          SELECT warehouseid
          FROM "workat"
          WHERE userid = ${userID}
        )
        AND current_timestamp <= po.approvedate::timestamp + INTERVAL '1 day'
        AND current_timestamp >= po.approvedate::timestamp
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
            gr.give_receivetype,
            ts.statusname,
            po.updatedat,
            us.firstname,
            us.lastname
        ORDER BY po.createdat DESC
        LIMIT ${limit}
        OFFSET ${limit} * ${page};
          `
      }
      if(status === 'Chờ được đăng'){
        postsQuery = `
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
          ts.statusname,
          gr.give_receivetype,
          po.updatedat,
          us.firstname,
		      us.lastname,
          CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
          CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count
        FROM Posts AS po
      LEFT JOIN "orders" od ON od.postid = po.postid
      LEFT JOIN "trace_status" ts ON po.statusid = ts.statusid
        LEFT JOIN "User" us ON po.owner = us.UserID
        LEFT JOIN Address ad ON po.addressid = ad.addressid
        LEFT JOIN "postreceiver" pr ON po.postid = pr.postid
        LEFT JOIN item it ON it.itemid = po.itemid
        LEFT JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
        LEFT JOIN "like_post" lp ON po.postid = lp.postid
        LEFT JOIN warehouse wh ON ad.addressid = wh.addressid
        LEFT JOIN "give_receivetype" gr ON gr.give_receivetypeid = po.givetypeid
        LEFT JOIN (
            SELECT DISTINCT ON (itemid) * FROM Image
        ) img ON img.itemid = po.itemid

        WHERE (od.status LIKE 'Hàng đã nhập kho')
        AND po.warehouseid = (
          SELECT warehouseid
          FROM "workat"
          WHERE userid = ${userID}
        )
        AND (od.givetypeid=3 OR od.givetypeid=4 )
        AND (po.statusid = 14 OR po.statusid = 12)
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
            gr.give_receivetype,
            ts.statusname,
            po.updatedat,
            us.firstname,
            us.lastname
        ORDER BY po.createdat DESC
        LIMIT ${limit}
        OFFSET ${limit} * ${page};
          `
      }
      let queryWarehousePost = ``
      if(status === 'Đang được nhận'){
        queryWarehousePost = `AND od.imgconfirmreceive = ' '`
        postsQuery = `
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
          ts.statusname,
          gr.give_receivetype,
          po.updatedat,
          us.firstname,
		      us.lastname,
          CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
          CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count
        FROM Posts AS po
      LEFT JOIN "orders" od ON od.postid = po.postid
      LEFT JOIN "trace_status" ts ON po.statusid = ts.statusid
        LEFT JOIN "User" us ON po.owner = us.UserID
        LEFT JOIN Address ad ON po.addressid = ad.addressid
        LEFT JOIN "postreceiver" pr ON po.postid = pr.postid
        LEFT JOIN item it ON it.itemid = po.itemid
        LEFT JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
        LEFT JOIN "like_post" lp ON po.postid = lp.postid
        LEFT JOIN warehouse wh ON ad.addressid = wh.addressid
        LEFT JOIN "give_receivetype" gr ON gr.give_receivetypeid = po.givetypeid
        LEFT JOIN (
            SELECT DISTINCT ON (itemid) * FROM Image
        ) img ON img.itemid = po.itemid

        WHERE po.iswarehousepost = true
        ${queryWarehousePost}
        AND po.warehouseid = (
          SELECT warehouseid
          FROM "workat"
          WHERE userid = ${userID}
        )
        AND (od.givetypeid=3 OR od.givetypeid=4 )
        AND (po.statusid = 14 OR po.statusid = 12)
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
            gr.give_receivetype,
            ts.statusname,
            po.updatedat,
            us.firstname,
            us.lastname
        ORDER BY po.createdat DESC
        LIMIT ${limit}
        OFFSET ${limit} * ${page};
          `
      }
      if(status === 'Đã cho thành công'){
        queryWarehousePost = `AND od.imgconfirmreceive != ' '`
        postsQuery = `
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
          ts.statusname,
          gr.give_receivetype,
          po.updatedat,
          us.firstname,
		      us.lastname,
          CAST(COUNT(DISTINCT lp.likeid) AS INTEGER) AS like_count,
          CAST(COUNT(DISTINCT pr.receiverid) AS INTEGER) AS receiver_count
        FROM Posts AS po
      LEFT JOIN "orders" od ON od.postid = po.postid
      LEFT JOIN "trace_status" ts ON po.statusid = ts.statusid
        LEFT JOIN "User" us ON po.owner = us.UserID
        LEFT JOIN Address ad ON po.addressid = ad.addressid
        LEFT JOIN "postreceiver" pr ON po.postid = pr.postid
        LEFT JOIN item it ON it.itemid = po.itemid
        LEFT JOIN item_type itt ON itt.itemtypeid = it.itemtypeid
        LEFT JOIN "like_post" lp ON po.postid = lp.postid
        LEFT JOIN warehouse wh ON ad.addressid = wh.addressid
        LEFT JOIN "give_receivetype" gr ON gr.give_receivetypeid = po.givetypeid
        LEFT JOIN (
            SELECT DISTINCT ON (itemid) * FROM Image
        ) img ON img.itemid = po.itemid

        WHERE po.iswarehousepost = true
        ${queryWarehousePost}
        AND po.warehouseid = (
          SELECT warehouseid
          FROM "workat"
          WHERE userid = ${userID}
        )
        AND (od.givetypeid=3 OR od.givetypeid=4 )
        AND (po.statusid = 14 OR po.statusid = 12)
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
            gr.give_receivetype,
            ts.statusname,
            po.updatedat,
            us.firstname,
            us.lastname
        ORDER BY po.createdat DESC
        LIMIT ${limit}
        OFFSET ${limit} * ${page};
          `
      }

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
}