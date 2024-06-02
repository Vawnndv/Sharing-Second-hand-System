import { Item } from '../Item';
import { Order } from '../Order';

import { Status } from '../Status';
import { Trace } from '../Trace';
import pool from "../../config/DatabaseConfig"
import { QueryResult } from 'pg';
import { UserManager } from './UserManager';
import { User } from '../User';
import { ItemManager } from './ItemManager';
import { PostManager } from './PostManager';
import { Post } from '../Post';
import { Address } from '../Address';
import { statusOrder } from '../../utils/statusOrder';
import { CardManager } from './CardManager';


interface FilterOrder {
  title: string;
  location: string;
  status: string;
  createdat: Date;
  image: string;
  orderid: number;
  statusname: string;
  statuscreatedat: Date;
  givetype: string;
  longitudegive: string;
  latitudegive: string;
  longitudereceive: string;
  latitudereceive: string;
  nametype: string;
  row_num: string;
}

enum QueryType {
  Status = 'status',
  Method = 'method'
}

function filterOrders(distance: string, time: string, category: string[], sort: string, latitude: string, longitude: string, IsGiver: boolean, data: FilterOrder[]): FilterOrder[] {
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
  const filteredData: FilterOrder[] = data.filter(item => {
      // Lọc theo khoảng cách
      let isValidDistance: boolean = true;
      if (distanceFloat !== -1) {
        if (IsGiver) {
            const distanceToReceiver: number = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(item.latitudereceive), parseFloat(item.longitudereceive));
            isValidDistance = distanceToReceiver <= distanceFloat;
        } else {
            const distanceToGiver: number = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(item.latitudegive), parseFloat(item.longitudegive));
            isValidDistance = distanceToGiver <= distanceFloat;
        }
      }

      // Lọc theo thời gian
      const isValidTime: boolean = timeInt !== -1 ? isTimeBefore(item.createdat, timeInt) : true;

      // Lọc theo danh mục
      let isValidCategory: boolean = category.includes(item.nametype) || category.includes("Tất cả");
      // Kết hợp tất cả các điều kiện
      return isValidDistance && isValidTime && isValidCategory;
  });

  // Sắp xếp dữ liệu nếu cần
  if (sort === "Mới nhất") {
      filteredData.sort((a, b) => b.statuscreatedat.getTime() - a.statuscreatedat.getTime());
  } else if (sort === "Gần nhất") {
      filteredData.sort((a, b) => {
          let distanceA, distanceB;
          if (IsGiver) {
              distanceA = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(a.latitudereceive), parseFloat(a.longitudereceive));
              distanceB = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(b.latitudereceive), parseFloat(b.longitudereceive));
          } else {
              distanceA = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(a.latitudegive), parseFloat(a.longitudegive));
              distanceB = calculateDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(b.latitudegive), parseFloat(b.longitudegive));
          }
          return distanceA - distanceB;
      });
  }

  return filteredData;
}

function buildStatusQuery(statusArray: string[], type: QueryType) {
  // Kiểm tra xem mảng trống không
  if (statusArray.length === 0) {
      return '';
  }

  let prefix: string;
  if (type === QueryType.Status) {
      prefix = 'o.status';
  } else if (type === QueryType.Method) {
      prefix = 'o.givetypeid';
  } else {
      throw new Error('Invalid query type');
  }

  // Tạo chuỗi truy vấn từ mảng status
  const statusQuery = 'AND (' + statusArray.map(status => {
      if (type === QueryType.Status) {
          return `${prefix} = '${status}'`;
      } else if (type === QueryType.Method) {
          return `${prefix} = ${status}`;
      }
  }).join(' OR ');

  return statusQuery + ')';
}

export class OrderManager {
  public constructor() {

  }

  public createOrder(orderID: number, title: string, receiverId: number, giverId: number,
    orderCode: string, qrCode: string, status: string, location: string, description: string,
    time: string, itemID: number, departure: string, item: Item, trace: Trace, currentStatus: Status): boolean {
    // code here
    return true;
  }

  public static async showOrders(userID: string | undefined, type: string | undefined, distance: any, time: any, category: any, sort:any, search:any, typeCard: any): Promise<Order[]> {
    // code here
    const client = await pool.connect();

    try {
      let values: any = [userID]
      let queryType =`AND o.status = '${type}'`
      if(type === 'Hàng đã nhập kho'){
        queryType = `
          AND o.status != 'Hàng đang được đến lấy'
          AND o.collaboratorreceiveid IS NOT NULL
        `
      }
      if(typeCard === "outputcard"){
        queryType = ''
      }
      let queryTime =``
      if(parseInt(time) !== -1){
        queryTime = `AND p.timeend >= NOW()
                      AND p.timeend <= NOW() + INTERVAL '${time} days'`
      }
      let categoryQuery = ``;
      if(category !== "Tất cả" ){

        let listCategory = []
        if(category !== ''){
          listCategory = category.split(',')
        }
        let listCategoryQuery = `'${listCategory[0]}'`
        
        for(let i = 1; i < listCategory.length; i++){
          listCategoryQuery += ` OR it.nametype = '${listCategory[i]}'`
        }
        
        categoryQuery = `AND EXISTS (
          SELECT it.nametype
          FROM "item_type" it
          WHERE it.itemtypeid IN (
            SELECT i.itemtypeid
            FROM "item" i
            WHERE o.itemid = i.itemid
          ) AND it.nametype = ${listCategoryQuery}
        )` 
      }

      const searchQuery = search ? `
        AND o.orderid = ${search}
      ` :
      ''
      
      const ordersQuery = `
            SELECT o.*, p.timestart, p.timeend
            FROM "orders" o
            JOIN "posts" p ON o.postid = p.postid
            WHERE o.orderid IN (
              SELECT ic.orderid FROM  ${(typeCard === "inputcard" || typeCard === undefined) ? "inputcard" : "outputcard"} ic
              WHERE ic.warehouseid = (
                SELECT w.warehouseid FROM "workat" w
                WHERE $1 = w.userid
              )
            ) 
            `+queryType+`
            `+queryTime+`
            `+categoryQuery+`
            `+searchQuery+`
            ORDER BY o.createdat DESC
          `;

          console.log('ordersQueryordersQueryordersQueryordersQueryordersQueryordersQueryordersQueryordersQueryordersQueryordersQueryordersQueryordersQueryordersQueryordersQuery', ordersQuery)

      const addressQuery = `
        SELECT * FROM "address"
        WHERE addressid = $1
      `
      const ordersResult: QueryResult = await client.query(ordersQuery, values);
      
      const ordersRow = ordersResult.rows;
      let result: any = []
      if(ordersRow.length > 0) {
        let addressReceiveDB = await client.query(addressQuery, [ordersRow[0].locationreceive]);

        const addressReceive = new Address(addressReceiveDB.rows[0].addressid, addressReceiveDB.rows[0].address, addressReceiveDB.rows[0].longitude, addressReceiveDB.rows[0].latitude)
    
        
        const orders: any = await Promise.all(ordersRow.map(async (row: any) => {
          const giver: User | undefined = await UserManager.getUser(row.usergiveid);
          const receive: User | undefined = await UserManager.getUser(row.collaboratorreceiveid);
          const item: Item | null = await ItemManager.viewDetailsItem(row.itemid);
  
          let addressGiveDB = await client.query(addressQuery, [row.locationgive]);
          const addressGive = new Address(addressGiveDB.rows[0].addressid, addressGiveDB.rows[0].address, addressGiveDB.rows[0].longitude, addressGiveDB.rows[0].latitude)

          if(parseInt(distance) !== -1){
            if(addressGive.getDistance(addressReceive)/1000 <= parseInt(distance)){

              const orderObj = new Order(
                row.orderid,
                row.title,
                receive,
                giver,
                row.ordercode,
                row.qrcode,
                row.status,
                row.location,
                row.description,
                row.time,
                item,
                row.departure,
                null,
                addressGive,
                addressReceive
              )
    
              orderObj.setTime(row.timestart, row.timeend);
              result.push(
                orderObj
              )
            }
          }else{
            const orderObj = new Order(
              row.orderid,
              row.title,
              receive,
              giver,
              row.ordercode,
              row.qrcode,
              row.status,
              row.location,
              row.description,
              row.time,
              item,
              row.departure,
              null,
              addressGive,
              addressReceive
            )
  
            orderObj.setTime(row.timestart, row.timeend);
            result.push(
              orderObj
            )
          }
          
        }));
  
        if(sort === 'Gần nhất' && result.length > 0){
          for(let i:number = 0; i < result.length; i++ ){

            let minAddress = new Address(result[i].addressGive.addressid,result[i].addressGive.address, result[i].addressGive.longitude, result[i].addressGive.latitude)
            let minDistance = minAddress.getDistance(addressReceive)
            let minIndex = i
            for(let j: number = i + 1; j < orders.length; j++){
              let addressj = new Address(result[i].addressGive.addressid,result[i].addressGive.address, result[i].addressGive.longitude, result[i].addressGive.latitude);
              let distancej = addressj.getDistance(addressReceive);
              if( distancej < minDistance){
                minDistance = distancej;
                minIndex = j;
  
                
              }
            }
  
            if(minIndex !== i){
              // hoán đổi vị trí
              let tempOrder = result[i]
              result[i] = result[minIndex]
              result[minIndex] = tempOrder
            }
          }
        }
      }
      
      return result;
    }catch (error) {
      console.log('error:', error);
      return [];
    } finally {
      client.release();
    }
  }

  
  public static async showOrdersReceiving(userID: string | undefined): Promise<any> {
    // code here
    const client = await pool.connect();

    try {
      let values: any = [userID]

          const ordersQuery = `
          SELECT o.*, p.timestart, p.timeend
          FROM "orders" o
          JOIN "posts" p ON o.postid = p.postid
          WHERE o.orderid IN (
            SELECT ic.orderid FROM "inputcard" ic
            WHERE ic.warehouseid = (
              SELECT w.warehouseid FROM "workat" w
              WHERE $1 = w.userid
            )
          ) 
          AND o.status = 'Hàng đang được đến lấy'
          AND CURRENT_DATE BETWEEN p.timestart AND p.timeend
          ORDER BY o.createdat DESC
        `;

      const addressQuery = `
        SELECT * FROM "address"
        WHERE addressid = $1
      `

      const ordersResult: QueryResult = await client.query(ordersQuery, values);
      
      const ordersRow = ordersResult.rows;
      let result: any = [{}]
      if(ordersRow.length > 0) {
        let addressReceiveDB = await client.query(addressQuery, [ordersRow[0].locationreceive]);
        const addressReceive = new Address(addressReceiveDB.rows[0].addressid,addressReceiveDB.rows[0].address, addressReceiveDB.rows[0].longitude, addressReceiveDB.rows[0].latitude)
    
        
        const orders: any = await Promise.all(ordersRow.map(async (row: any) => {
          const giver: User | undefined = await UserManager.getUser(row.usergiveid);
          const receive: User | undefined = await UserManager.getUser(row.collaboratorreceiveid);
          const item: Item | null = await ItemManager.viewDetailsItem(row.itemid);
  
          let addressGiveDB = await client.query(addressQuery, [row.locationgive]);
          const addressGive = new Address(addressGiveDB.rows[0].addressid, addressGiveDB.rows[0].address, addressGiveDB.rows[0].longitude, addressGiveDB.rows[0].latitude)
  
          
          const orderObj = new Order(
            row.orderid,
            row.title,
            receive,
            giver,
            row.ordercode,
            row.qrcode,
            row.status,
            row.location,
            row.description,
            row.time,
            item,
            row.departure,
            null,
            addressGive,
            addressReceive
          )

          orderObj.setTime(row.timestart, row.timeend);
          result.push(
            orderObj
          )
          
        }));

      }
      
      return result;
    }catch (error) {
      console.log('error:', error);
      return [];
    } finally {
      client.release();
    }
  }

  public static async showOrdersStatistic(userID: string | undefined, type: string | undefined, time: string | undefined): Promise<Order[]> {
    // code here
    const client = await pool.connect();

    try {
      const ordersQuery = `
          SELECT o.*, p.timestart, p.timeend
          FROM "orders" o
          JOIN "posts" p ON o.postid = p.postid
          WHERE o.orderid IN (
            SELECT ic.orderid FROM "inputcard" ic
            WHERE ic.warehouseid = (
              SELECT w.warehouseid FROM "workat" w
              WHERE $1 = w.userid
            )
          )
          AND o.status = '${type}'
          AND p.timeend >= NOW() - INTERVAL '${time}'`;

        const addressQuery = `
        SELECT * FROM "address"
        WHERE addressid = $1
      `
      
      const values: any = [userID]
  
      const ordersResult: QueryResult = await client.query(ordersQuery, values);
      
      const ordersRow = ordersResult.rows;

      let result: any = []
  
      if(ordersRow.length > 0) {
        let addressReceiveDB = await client.query(addressQuery, [ordersRow[0].locationreceive]);
        const addressReceive = new Address(addressReceiveDB.rows[0].addressid, addressReceiveDB.rows[0].address, addressReceiveDB.rows[0].longitude, addressReceiveDB.rows[0].latitude)
    
        
        const orders: any = await Promise.all(ordersRow.map(async (row: any) => {
          const giver: User | undefined = await UserManager.getUser(row.usergiveid);
          const receive: User | undefined = await UserManager.getUser(row.collaboratorreceiveid);
          const item: Item | null = await ItemManager.viewDetailsItem(row.itemid);
  
          let addressGiveDB = await client.query(addressQuery, [row.locationgive]);
          const addressGive = new Address(addressGiveDB.rows[0].addressid, addressGiveDB.rows[0].address, addressGiveDB.rows[0].longitude, addressGiveDB.rows[0].latitude)
          
          const orderObj = new Order(
            row.orderid,
            row.title,
            receive,
            giver,
            row.ordercode,
            row.qrcode,
            row.status,
            row.location,
            row.description,
            row.time,
            item,
            row.departure,
            null,
            addressGive,
            addressReceive
          )

          orderObj.setTime(row.timestart, row.timeend);
          result.push(
            orderObj
          )
            
    
          
        }));
  
      }

      // console.log(orders)
      return result;
    }catch (error) {
      console.log('error:', error);
      return [];
    } finally {
      client.release();
    }
  }

  public static async showOrderDetails(orderID: string | undefined, typeCard: string | undefined): Promise<any | null> {
    // code here
    const client = await pool.connect();

    try {
      const ordersQuery = `
      SELECT * FROM "orders" WHERE orderid = $1`;

      const values: any = [orderID]
  
      const ordersResult: QueryResult = await client.query(ordersQuery, values);
      
      const ordersRow = ordersResult.rows[0];
  
      const giver: User | undefined = await UserManager.getUser(ordersRow.usergiveid);
      const receive: User | undefined = await UserManager.getUser(typeCard === "outputcard" && (ordersRow.givetypeid === 2 || ordersRow.givetypeid === 5) ? ordersRow.userreceiveid : ordersRow.collaboratorreceiveid);
      const item: Item | null = await ItemManager.viewDetailsItem(ordersRow.itemid);
      const post: Post | null = await PostManager.getDetailsPost(ordersRow.postid);

      const queryImageItem = `
        SELECT path FROM "image" 
        WHERE itemid = $1
      `
      
      const path = await client.query(queryImageItem, [ordersRow.itemid])

      
      const addressQuery = `
      SELECT * FROM "address"
      WHERE addressid = $1
    `
    
    let addressReceiveDB = await client.query(addressQuery, [ordersRow.locationreceive]);
    const addressReceive = new Address(addressReceiveDB.rows[0].addressid,addressReceiveDB.rows[0].address, addressReceiveDB.rows[0].longitude, addressReceiveDB.rows[0].latitude)

    let addressGiveDB = await client.query(addressQuery, [ordersRow.locationgive]);
    const addressGive = new Address(addressGiveDB.rows[0].addressid, addressGiveDB.rows[0].address, addressGiveDB.rows[0].longitude, addressGiveDB.rows[0].latitude)

    let order: Order = new Order(
                            ordersRow.orderid,
                            ordersRow.title,
                            receive,
                            giver,
                            ordersRow.ordercode,
                            ordersRow.qrcode,
                            ordersRow.status,
                            ordersRow.location,
                            ordersRow.description,
                            ordersRow.time,
                            item,
                            ordersRow.departure,
                            post,
                            addressGive,
                            addressReceive
                          )
      order.setGiveTypeID(ordersRow.givetypeid)
      return [{
        order: order,
        image: path.rows[0].path,
        imgConfirm: ordersRow.imgconfirm === ' ' ? ordersRow.imgconfirmreceive : ordersRow.imgconfirm
      }];

    }catch (error) {
      console.log('error:', error);
      return null;
    } finally {
      client.release();
    }
  }

  public static async pinOrder(orderID: string | undefined, collaboratorReceiveID: string | undefined): Promise<any | null> {
    const client = await pool.connect()

    let queryGetOrder = `
      SELECT collaboratorreceiveid
      FROM "orders"
      WHERE orderid = ${orderID}
    `

    let status = (collaboratorReceiveID === null ? 'Chờ cộng tác viên lấy hàng' : 'Hàng đang được đến lấy')


    let query = `
      UPDATE "orders"
      SET collaboratorreceiveid = $2, status='${status}'
      WHERE orderid = $1
    `

    const values:any = [orderID, collaboratorReceiveID]

    try {
      const resultQueryOrder: QueryResult = await client.query(queryGetOrder)

      if(resultQueryOrder.rows[0].collaboratorreceiveid !== null && resultQueryOrder.rows[0].collaboratorreceiveid != collaboratorReceiveID){
        return false
      }
      const resultQuery: QueryResult = await client.query(query, values);

      return true;
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public static async getOrderList (userID: string, distance: string, time: string, category: string[], sort: string, latitude: string, longitude: string): Promise<any> {

    const client = await pool.connect();
    // let query = `
    //   SELECT *,
    //   CASE
    //       WHEN UserReceiveID IS NULL THEN false
    //       ELSE true
    //   END AS isReciever
    //   FROM (
    //   SELECT *,
    //           ROW_NUMBER() OVER (PARTITION BY oo.orderid ORDER BY oo.statuscreatedat DESC) AS row_num
    //   FROM (
    //       SELECT 
    //           po.Title, 
    //           adg.address AS Location, 
    //           o.Status,
    //           o.CreatedAt,
    //           i.Path AS Image, 
    //           o.OrderID,
    //           ts.StatusName,
    //           th.Time AS StatusCreatedAt,
    //           o.GiveType,
    //           adg.Longitude AS LongitudeGive,
    //           adg.Latitude AS LatitudeGive,
    //           adr.Longitude AS LongitudeReceive,
    //           adr.Latitude AS LatitudeReceive,
    //           itt.NameType,
    //           o.imgconfirmreceive,
    //           o.UserReceiveID AS UserReceiveID
    //       FROM 
    //           Orders o
    //       JOIN 
    //           Image i ON o.ItemID = i.ItemID
    //       JOIN 
    //           Trace t ON o.OrderID = t.OrderID
    //       JOIN 
    //           Trace_History th ON t.TraceID = th.TraceID
    //       JOIN 
    //           Trace_Status ts ON th.StatusID = ts.StatusID
    //       JOIN 
    //           Address adg ON adg.AddressID = o.LocationGive
    //       JOIN 
    //           Address adr ON adr.AddressID = o.LocationReceive
    //       JOIN 
    //           Posts po ON po.PostID = o.PostID
    //       JOIN 
    //           Item it ON it.ItemID = po.ItemID
    //       JOIN 
    //           Item_Type itt ON itt.ItemTypeID = it.ItemTypeID
    //       WHERE 
    //           {placeholder}
    //       ORDER BY
    //           th.Time DESC
    //   ) AS oo
    //   ) AS ranked_orders
    //   WHERE row_num = 1;
    // `
    let query = `
    WITH RankedOrders AS (
      SELECT 
          po.Title, 
          adg.address AS Location, 
          o.Status,
          o.CreatedAt,
          i.Path AS Image, 
          o.OrderID,
          ts.StatusName,
          th.Time AS StatusCreatedAt,
          o.GiveType,
          adg.Longitude AS LongitudeGive,
          adg.Latitude AS LatitudeGive,
          adr.Longitude AS LongitudeReceive,
          adr.Latitude AS LatitudeReceive,
          itt.NameType,
          o.imgconfirmreceive,
          o.UserReceiveID,
          ROW_NUMBER() OVER (PARTITION BY o.orderid ORDER BY th.Time DESC) AS row_num
      FROM 
          Orders o
      JOIN 
          Image i ON o.ItemID = i.ItemID
      JOIN 
          Trace t ON o.OrderID = t.OrderID
      JOIN 
          Trace_History th ON t.TraceID = th.TraceID
      JOIN 
          Trace_Status ts ON th.StatusID = ts.StatusID
      JOIN 
          Address adg ON adg.AddressID = o.LocationGive
      JOIN 
          Address adr ON adr.AddressID = o.LocationReceive
      JOIN 
          Posts po ON po.PostID = o.PostID
      JOIN 
          Item it ON it.ItemID = po.ItemID
      JOIN 
          Item_Type itt ON itt.ItemTypeID = it.ItemTypeID
      WHERE 
      {placeholder}
  )
  SELECT *,
        CASE
            WHEN UserReceiveID IS NULL THEN false
            ELSE true
        END AS isReceiver
  FROM RankedOrders
  WHERE row_num = 1;
  
    `
    const values : any = [userID];
    
    try {
      const resultGive: QueryResult = await client.query(query.replace('{placeholder}', `(o.UserGiveID = $1) AND ts.StatusName <> 'Hoàn tất'`), values);
      const resultReceive: QueryResult = await client.query(query.replace('{placeholder}', `(o.UserReceiveID = $1) AND ts.StatusName <> 'Hoàn tất'`), values);
      const mergedResults = {
        orderGive: filterOrders(distance, time, category, sort, latitude, longitude, true, resultGive.rows),
        orderReceive: filterOrders(distance, time, category, sort, latitude, longitude, false, resultReceive.rows)
      };
      console.log('Get orders list success:', mergedResults);
      return mergedResults
    } catch (error) {
      console.error('Error get orders:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async getOrderFinishList (userID: string, distance: string, time: string, category: string[], sort: string, latitude: string, longitude: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT *
      FROM (
          SELECT *,
                ROW_NUMBER() OVER (PARTITION BY oo.orderid ORDER BY oo.statuscreatedat DESC) AS row_num
          FROM (
              SELECT 
                  po.Title, 
                  adg.address AS Location,  
                  o.Status,
                  o.CreatedAt,
                  i.Path AS Image, 
                  o.OrderID,
                  ts.StatusName,
                  th.Time AS StatusCreatedAt,
                  o.GiveType,
            adg.Longitude AS LongitudeGive,
            adg.Latitude AS LatitudeGive,
            adr.Longitude AS LongitudeReceive,
            adr.Latitude AS LatitudeReceive,
            itt.NameType,
            o.imgconfirmreceive
              FROM 
                  Orders o
              JOIN 
                  Image i ON o.ItemID = i.ItemID
              JOIN 
                  Trace t ON o.OrderID = t.OrderID
              JOIN 
                  Trace_History th ON t.TraceID = th.TraceID
              JOIN 
                  Trace_Status ts ON th.StatusID = ts.StatusID
              JOIN 
                  Address adg ON adg.AddressID = o.LocationGive
              JOIN 
                  Address adr ON adr.AddressID = o.LocationReceive
              JOIN 
                  Posts po ON po.PostID = o.PostID
              JOIN 
                  Item it ON it.ItemID = po.ItemID
              JOIN 
                  Item_Type itt ON itt.ItemTypeID = it.ItemTypeID
              WHERE 
                {placeholder}
              ORDER BY
                  th.Time DESC
          ) AS oo
      ) AS ranked_orders
      WHERE row_num = 1;
      `;
    const values : any = [userID];
    
    try {
      const resultGive: QueryResult = await client.query(query.replace('{placeholder}', `(o.UserGiveID = $1) AND ts.StatusName = 'Hoàn tất'`), values);
      const resultReceive: QueryResult = await client.query(query.replace('{placeholder}', `(o.UserReceiveID = $1)  AND ts.StatusName = 'Hoàn tất'`), values);
      const mergedResults = {
        orderGive: filterOrders(distance, time, category, sort, latitude, longitude, true, resultGive.rows),
        orderReceive: filterOrders(distance, time, category, sort, latitude, longitude, false, resultReceive.rows)
    };
      console.log('Get orders finish list success:', mergedResults);
      return mergedResults
    } catch (error) {
      console.error('Error get orders:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async getTrackingOrderByID (orderID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT 
          ts.StatusName,
          th.Time AS CreatedAt
      FROM 
          Trace t
      JOIN 
          Trace_History th ON t.TraceID = th.TraceID
      JOIN 
          Trace_Status ts ON th.StatusID = ts.StatusID
      WHERE 
          t.OrderID = $1
      ORDER BY 
          th.Time ASC
      `;
    const values : any = [orderID];
    
    try {
      const result: QueryResult = await client.query(query, values);
      console.log('Get orders finish list success:', result.rows);
      return result.rows
    } catch (error) {
      console.error('Error get orders:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async updateCompleteOrder (orderID: string, url: string) : Promise<boolean> {

    const client = await pool.connect()

    try{
      const query = `
        UPDATE "orders"
        SET status = 'Hàng đã nhập kho', imgconfirm = '${url}'
        WHERE orderid = $1
      `

      const result: QueryResult = await client.query(query, [orderID])
      return true;
    }catch(error){
      console.log(error)
      return false
    }finally{
      client.release()
    }
  }

  public static async updateStatusOrder (orderID: string, status: string) : Promise<boolean> {

    const client = await pool.connect()

    try{
      const query = `
        UPDATE "orders"
        SET status = '${status}'
        WHERE orderid = $1
      `

      let queryGetOrder = `
        SELECT status
        FROM "orders"
        WHERE orderid = ${orderID}
      `

      const resultQueryOrder: QueryResult = await client.query(queryGetOrder)
      if(resultQueryOrder.rows[0].status != status){
        return false
      }
      const result: QueryResult = await client.query(query, [orderID])
      return true;
    }catch(error){
      console.log(error)
      return false
    }finally{
      client.release()
    }
  }

  public static async uploadImageConfirmOrder (orderid: string, imgconfirmreceive: string) : Promise<boolean> {
    const client = await pool.connect()
    try{
      const query = `
        UPDATE "orders"
        SET imgconfirmreceive = $1
        WHERE orderid = $2
      `
      const result: QueryResult = await client.query(query, [imgconfirmreceive, orderid])
      const res = await this.updateStatusOfOrder(orderid, statusOrder.COMPLETED.statusid)

      // Create output card
      const queryOrder = `
      SELECT 
        o.giveTypeid,
        o.Warehouseid,
        o.userreceiveid,
        po.itemid
      FROM Orders o
      LEFT JOIN Posts po ON po.postid = o.postid
      WHERE o.orderid = $1
      `
      const resultOrder: QueryResult = await client.query(queryOrder, [orderid])

      if (resultOrder.rows[0].givetypeid == 2 || resultOrder.rows[0].givetypeid == 3 || resultOrder.rows[0].givetypeid == 4 || resultOrder.rows[0].givetypeid == 5)
        await CardManager.createCardOutput(resultOrder.rows[0].warehouseid, resultOrder.rows[0].userreceiveid, parseInt(orderid), resultOrder.rows[0].itemid)

      return true;
    }catch(error){
      console.log(error)
      return false
    }finally{
      client.release()
    }
  }

  
  public static async updateOrderReceiver ( orderid: string, userreceiveid: string, givetypeid: string, givetype: string, warehouseid: string ) : Promise<boolean> {
    const client = await pool.connect()

    try{
      const query = `
        UPDATE "orders"
        SET userreceiveid = $1, givetypeid = $3, givetype = $4, warehouseid = $5
        WHERE orderid = $2
      `
      const result: QueryResult = await client.query(query, [userreceiveid, orderid, givetypeid, givetype, warehouseid])
      return true;
    }catch(error){
      console.log(error)
      return false;
    }finally{
      client.release()
    }
  }

  public static async getOrderDetails(orderID: number): Promise<Order | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
      SELECT *,
        CASE
            WHEN userreceiveid IS NULL THEN false
            ELSE true
        END AS isReciever
        FROM (
          SELECT 
                o.orderid,
                o.usergiveid,
                o.userreceiveid,
                o.title,
                ad.address,
                grt.give_receivetype as givetype,
                o.status,
                i.Path AS Image,
                th.Time AS StatusCreatedAt,
                o.imgconfirmreceive,
                o.postid,
                u.avatar,
                u.firstname,
                u.lastname,
                o.createdat,
                po.description,
                po.itemid,
                us.avatar AS avatarreceive,
                us.firstname AS firstnamereceive,
                us.lastname AS lastnamereceive,
                us.phonenumber AS phonenumberreceive
              FROM orders AS o
              JOIN Address ad ON ad.AddressID = o.LocationGive
              JOIN give_receivetype grt ON grt.give_receivetypeid = o.givetypeid
              JOIN Image i ON o.ItemID = i.ItemID
              JOIN Trace t ON o.OrderID = t.OrderID
              JOIN Trace_History th ON t.TraceID = th.TraceID
              LEFT JOIN "User" u ON u.userid = o.usergiveid
              LEFT JOIN "User" us ON us.userid = o.userreceiveid
              LEFT JOIN Posts po ON po.postid = o.postid
              WHERE o.orderid = $1
          LIMIT 1)AS ranked_orders
        
      `, [orderID]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return row
    } finally {
      client.release()
    }
  }

  public static async VerifyOrderQR(orderID: number): Promise<Order | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          o.orderid,
          o.userreceiveid,
          o.usergiveid,
          o.postid
        FROM orders AS o
        WHERE o.orderid = $1 AND o.givetypeid != 3 AND o.givetypeid != 4
      `, [orderID]);
      if (result.rows.length === 0) {
        return null;
      }
      const row = result.rows[0];
      return row
    } finally {
      client.release()
    }
  }

  public static async updateStatusOfOrder(orderID: string, statusID: string): Promise<boolean> {
    const client = await pool.connect();
    console.log(orderID, statusID)
    try {
        const query = `
        -- Khai báo biến và gán giá trị cho nó
        DO $$
        DECLARE
            NewStatusName VARCHAR(255);
            NewStraceID INTEGER;
        
        BEGIN
            SELECT StatusName INTO NewStatusName
            FROM Trace_Status
            WHERE StatusID = '${statusID}';
        
            SELECT TraceID INTO NewStraceID
            FROM Trace
            WHERE OrderID = '${orderID}';
        
            UPDATE Trace
            SET CurrentStatus = NewStatusName
            WHERE OrderID = '${orderID}';
        
            INSERT INTO Trace_History (StatusName, Time, TraceID, StatusID)
            VALUES (
                NewStatusName,
                CURRENT_TIMESTAMP,
                NewStraceID,
                '${statusID}'
            );
      
            UPDATE Orders
            SET Status = NewStatusName
            WHERE OrderID = '${orderID}';
        END $$;
        `;

        const result: QueryResult = await client.query(query);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    } finally {
        client.release();
    }
  }


  
  public static async createOrder (title: string, departure: string, time: Date, description: string, location: string, status: string, qrcode: string, ordercode: string, usergiveid: number, itemid: number, postid: number, givetype: string, imgconfirm: string, locationgive: number, locationreceive: number, givetypeid: number, imgconfirmreceive: string, warehouseid: number, userreceiveid: number): Promise<void> {

    const client = await pool.connect();
    const query = `
      INSERT INTO ORDERS(title, departure, time, description, location, status, qrcode, ordercode, usergiveid, itemid, postid, givetype, imgconfirm, locationgive, locationreceive, givetypeid, imgconfirmreceive, warehouseid, userreceiveid)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *;
      `;
      // TODO sửa lại locationgive and locationreceive
    const values : any = [title, departure, time, description, location, status, qrcode, ordercode, usergiveid, itemid, postid, givetype, imgconfirm, locationgive, locationreceive, givetypeid, imgconfirmreceive, warehouseid, userreceiveid];
    
    try {
      const result: QueryResult = await client.query(query, values);
      console.log('Order inserted successfully:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting order:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async createTrace (currentstatus: string, orderid: number): Promise<void> {
    const client = await pool.connect();
    const query = `
        INSERT INTO TRACE(currentstatus, orderid)
        VALUES($1, $2)
        RETURNING *;
      `;
    const values : any = [currentstatus, orderid];
    
    try {
      const result: QueryResult = await client.query(query, values);
      console.log('Trace inserted successfully:', result.rows[0]);
      // const statusid_postItem = '1';
      // const statusid_waitForApporve = '2';
      // const statusid_approved = '12';
      const statusid_waitForGiver = '13';
      const statusid_waitForCollaborator = '7';
      const statusid_waitForReceiver = '3';


      // const createTraceHistoryPostItemResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid_postItem)
      // console.log('Trace History Post Item inserted successfully:', createTraceHistoryPostItemResult);
      // const createTraceHistoryWaitForApproveResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid_waitForApporve)
      // console.log('Trace History Wait For Approve inserted successfully:', createTraceHistoryWaitForApproveResult);
      if(currentstatus == 'Chờ người cho giao hàng'){
        // const createTraceHistoryApprovedResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid_approved)
        // console.log('Trace History Approved inserted successfully:', createTraceHistoryApprovedResult);
        const createTraceHistoryWaitForGiverResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid_waitForGiver)
        console.log('Trace History Wait For Giver inserted successfully:', createTraceHistoryWaitForGiverResult);
      }

      if(currentstatus == 'Chờ cộng tác viên lấy hàng'){
        // const createTraceHistoryApprovedResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid_approved)
        // console.log('Trace History Approved inserted successfully:', createTraceHistoryApprovedResult);
        const createTraceHistoryWaitForCollaboratorResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid_waitForCollaborator)
        console.log('Trace History Wait For Giver inserted successfully:', createTraceHistoryWaitForCollaboratorResult);
      }

      if(currentstatus == 'Chờ người nhận lấy hàng'){
        // const createTraceHistoryApprovedResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid_approved)
        // console.log('Trace History Approved inserted successfully:', createTraceHistoryApprovedResult);
        const createTraceHistoryWaitForReceiverResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid_waitForReceiver)
        console.log('Trace History Wait For Receiver inserted successfully:', createTraceHistoryWaitForReceiverResult);
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting trace:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  
  public static async updateTraceStatus(orderid: number, newstatus: string, statusid: string): Promise<boolean> {
    const client = await pool.connect();

    const query =`
        UPDATE "trace"
        SET currentstatus = '${newstatus}'
        WHERE orderid = ${orderid}
        RETURNING *
    `

    try {
      const result: QueryResult = await client.query(query);
      const createTraceHistoryPostItemResult = await OrderManager.updateStatusOfOrder(result.rows[0].orderid.toString(), statusid);
      console.log('Trace History inserted successfully:', createTraceHistoryPostItemResult);

      return result.rows[0];
    } catch (error) {
      console.log(error) 
      return false
    }
    
  };



  public static async updateReceiveID(postID: string | undefined, receiveID: string | undefined, warehouseid: string | undefined): Promise<boolean> {
    const client = await pool.connect();

    const query =`
        UPDATE "orders"
        SET userreceiveid = ${receiveID}, warehouseid = ${warehouseid}
        WHERE orderid = ${postID}
    `

    try {
      const result: QueryResult = await client.query(query);

      return true
    } catch (error) {
      console.log(error) 
      return false
    }
    
  };



  public static async getOrderByPostID(postID: number): Promise<Order | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT * FROM ORDERS JOIN ADDRESS ON locationgive = addressid WHERE postid = $1`, [postID]);
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

  public static async getOrderListReceive (userID: string): Promise<any> {

    const client = await pool.connect();
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
        ORDER BY i.CreatedAt ASC -- or any other criteria to pick the first image
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
      Postreceiver por ON po.PostID = por.PostID
    LEFT JOIN 
      Trace_Status ts ON po.StatusID = ts.StatusID
    LEFT JOIN
      Give_receivetype grt ON grt.give_receivetypeid = po.givetypeid
    JOIN 
      postreceiver pr ON pr.postid = po.postid
    WHERE 
      pr.receiverid = $1 AND ts.StatusName = 'Đã duyệt'
    ORDER BY
      po.CreatedAt DESC;

    `
    const values : any = [userID];
    
    try {
      const resultReceive: QueryResult = await client.query(query, values);
      return resultReceive.rows
    } catch (error) {
      console.error('Error get posts:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async getOrderListByStatus (userID: string, status: string[], method: string[], limit: string, page: string, isOverdue: boolean, filterValue: any): Promise<any> {

    const client = await pool.connect();
    let query = `
    SELECT
        u.avatar,
        u.firstname,
        u.lastname,
        po.postid,
        po.title,
        po.createdat,
        po.description,
        o.orderid,
        o.status,
        adg.Longitude AS LongitudeGive,
        adg.Latitude AS LatitudeGive,
        adr.Longitude AS LongitudeReceive,
        adr.Latitude AS LatitudeReceive,
        o.CreatedAt,
        itt.NameType,
        o.CreatedAt AS StatusCreatedAt,
        MIN(img.path) AS path
    FROM
        Orders o
    LEFT JOIN Posts po ON po.postid = o.postid
    LEFT JOIN "User" u ON po.owner = u.userid
    LEFT JOIN Item it ON it.itemid = po.itemid
    LEFT JOIN Image img ON img.itemid = it.itemid
    LEFT JOIN Address ad ON ad.addressid = po.addressid
    LEFT JOIN Address adg ON adg.AddressID = o.LocationGive
    LEFT JOIN Address adr ON adr.AddressID = o.LocationReceive
		LEFT JOIN Item_Type itt ON itt.ItemTypeID = it.ItemTypeID
    LEFT JOIN Workat w ON w.userid = ${userID}
    LEFT JOIN Warehouse wh ON w.warehouseid = wh.warehouseid
    WHERE
      wh.warehouseid = o.warehouseid
      {placeholder1}
      {placeholder2}
    ${isOverdue === true ? 'AND po.timeend < CURRENT_TIMESTAMP' : ''}
    GROUP BY
        u.avatar,
        u.firstname,
        u.lastname,
        po.postid,
        po.title,
        po.createdat,
        po.description,
        o.orderid,
        o.status,
        adg.Longitude,
        adg.Latitude,
        adr.Longitude,
        adr.Latitude,
        o.CreatedAt,
        itt.NameType
    `;
    
    try {
        // Thực hiện truy vấn chính để lấy dữ liệu theo phân trang
        const result = await client.query(query
          .replace('{placeholder1}', buildStatusQuery(status, QueryType.Status))
          .replace('{placeholder2}', buildStatusQuery(method, QueryType.Method))
        );

        const resultAfterFilter = filterOrders(filterValue.distance, filterValue.time, filterValue.category, filterValue.sort, filterValue.latitude, filterValue.longitude, false, result.rows)
        
        const totalItems = resultAfterFilter.length;

        // Trả về cả dữ liệu và tổng số lượng item trong một đối tượng
        return { orders: resultAfterFilter.slice(parseInt(page) * parseInt(limit), parseInt(page) * parseInt(limit) + parseInt(limit)), totalItems: totalItems };
    } catch (error) {
        console.error('Error get orders:', error);
    } finally {
        client.release(); // Release client sau khi sử dụng
    }
  }


}
