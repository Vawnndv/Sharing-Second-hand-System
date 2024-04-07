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


export class OrderManager {
  public constructor() {

  }

  public createOrder(orderID: number, title: string, receiverId: number, giverId: number,
    orderCode: string, qrCode: string, status: string, location: string, description: string,
    time: string, itemID: number, departure: string, item: Item, trace: Trace, currentStatus: Status): boolean {
    // code here
    return true;
  }

  public static async showOrders(userID: string | undefined, type: string | undefined, distance: any, time: any, category: any, sort:any): Promise<Order[]> {
    // code here
    const client = await pool.connect();

    try {
      let values: any = [userID,type]
      let queryTime =``
      if(time !== 'Tất cả'){
        queryTime = `AND p.timestart >= NOW() - INTERVAL '${time} days'`
      }
      let categoryQuery = ``;
      if(category !== "Tất cả" ){
        categoryQuery = `AND EXISTS (
          SELECT it.nametype
          FROM "item_type" it
          WHERE it.itemtypeid = (
            SELECT i.itemtypeid
            FROM "item" i
            WHERE o.itemid = i.itemid
          ) AND it.nametype LIKE N'${category}'
        )` 
      }
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
            AND o.status = $2
            AND CURRENT_DATE BETWEEN p.timestart AND p.timeend
            `+queryTime+`
            `+categoryQuery+`
            ORDER BY o.createdat DESC
          `;

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
    
        console.log(addressReceive)
        
        const orders: any = await Promise.all(ordersRow.map(async (row: any) => {
          const giver: User | undefined = await UserManager.getUser(row.usergiveid);
          const receive: User | undefined = await UserManager.getUser(row.collaboratorreceiveid);
          const item: Item | null = await ItemManager.viewDetailsItem(row.itemid);
  
          let addressGiveDB = await client.query(addressQuery, [row.locationgive]);
          const addressGive = new Address(addressGiveDB.rows[0].addressid, addressGiveDB.rows[0].address, addressGiveDB.rows[0].longitude, addressGiveDB.rows[0].latitude)
          console.log(addressGive)
          console.log(addressGive.getDistance(addressReceive)/1000, parseInt(distance))
          if(distance !== 'Tất cả'){
            if(addressGive.getDistance(addressReceive)/1000 <= parseInt(distance)){
              console.log(true)
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
            console.log(result[i], result.length)
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
    
        console.log(addressReceive)
        
        const orders: any = await Promise.all(ordersRow.map(async (row: any) => {
          const giver: User | undefined = await UserManager.getUser(row.usergiveid);
          const receive: User | undefined = await UserManager.getUser(row.collaboratorreceiveid);
          const item: Item | null = await ItemManager.viewDetailsItem(row.itemid);
  
          let addressGiveDB = await client.query(addressQuery, [row.locationgive]);
          const addressGive = new Address(addressGiveDB.rows[0].addressid, addressGiveDB.rows[0].address, addressGiveDB.rows[0].longitude, addressGiveDB.rows[0].latitude)
          console.log(addressGive)
  
          
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

  // public static async showOrdersOnWeek(userID: string | undefined, type: string | undefined, time: string | undefined): Promise<Order[]> {
  //   // code here
  //   const client = await pool.connect();

  //   try {
  //     const ordersQuery = `
  //         SELECT o.* FROM "orders" o
  //         WHERE o.orderid IN (
  //           SELECT ic.orderid FROM "inputcard" ic
  //           WHERE ic.warehouseid = (
  //             SELECT w.warehouseid FROM "workat" w
  //             WHERE $1 = w.userid
  //           )
  //         )
  //         AND EXISTS (
  //           SELECT 1
  //           FROM "posts" p
  //           WHERE p.postid = o.postid
  //           AND CURRENT_DATE BETWEEN p.timestart AND p.timeend
  //           AND p.timeend >= NOW() - INTERVAL '${time}'
  //         )
  //         AND o.status = '${type}'`;

  //     const values: any = [userID]
  
  //     const ordersResult: QueryResult = await client.query(ordersQuery, values);
      
  //     const ordersRow = ordersResult.rows;
  
  //     const orders = await Promise.all(ordersRow.map(async (row: any) => {
  //       const giver: User | undefined = await UserManager.getUser(row.usergiveid);
  //       const receive: User | undefined = await UserManager.getUser(row.userreceiveid);
  //       const item: Item | null = await ItemManager.viewDetailsItem(row.itemid);
  //       return new Order(
  //         row.orderid,
  //         row.title,
  //         receive,
  //         giver,
  //         row.ordercode,
  //         row.qrcode,
  //         row.status,
  //         row.location,
  //         row.description,
  //         row.time,
  //         item,
  //         row.departure,
  //         null,
  //         null,
  //         null
  //       );
  //     }));

  //     // console.log(orders)
  //     return orders;
  //   }catch (error) {
  //     console.log('error:', error);
  //     return [];
  //   } finally {
  //     client.release();
  //   }
  // }

  public static async showOrderDetails(orderID: string | undefined): Promise<any | null> {
    // code here
    const client = await pool.connect();

    try {
      const ordersQuery = `
      SELECT * FROM "orders" WHERE orderid = $1`;

      const values: any = [orderID]
  
      const ordersResult: QueryResult = await client.query(ordersQuery, values);
      
      const ordersRow = ordersResult.rows[0];
  
      const giver: User | undefined = await UserManager.getUser(ordersRow.usergiveid);
      const receive: User | undefined = await UserManager.getUser(ordersRow.collaboratorreceiveid);
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
      return [{
        order: new Order(
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
        ),
        image: path.rows[0].path,
        imgConfirm: ordersRow.imgconfirm
      }];
      

      // console.log(orders)
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

    let query = `
      UPDATE "orders"
      SET collaboratorreceiveid = $2
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


  // public getOrderDetails(orderID: string): Order {
  //   // code here
  //   return new Order('');
  // }

  public static async getOrderList (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT *
      FROM (
          SELECT *,
                ROW_NUMBER() OVER (PARTITION BY oo.orderid ORDER BY oo.statuscreatedat DESC) AS row_num
          FROM (
              SELECT 
                  o.Title, 
                  o.Location, 
                  o.Status,
                  o.CreatedAt,
                  i.Path AS Image, 
                  o.OrderID,
                  ts.StatusName,
                  th.Time AS StatusCreatedAt,
                  o.GiveType
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
      const resultGive: QueryResult = await client.query(query.replace('{placeholder}', `(o.UserGiveID = $1)`), values);
      const resultReceive: QueryResult = await client.query(query.replace('{placeholder}', `(o.UserReceiveID = $1)`), values);
      const mergedResults = {
        orderGive: resultGive.rows,
        orderReceive: resultReceive.rows
    };
      console.log('Get orders list success:', mergedResults);
      return mergedResults
    } catch (error) {
      console.error('Error get orders:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async getOrderFinishList (userID: string): Promise<any> {

    const client = await pool.connect();
    let query = `
      SELECT *
      FROM (
          SELECT *,
                ROW_NUMBER() OVER (PARTITION BY oo.orderid ORDER BY oo.statuscreatedat DESC) AS row_num
          FROM (
              SELECT 
                  o.Title, 
                  o.Location, 
                  o.Status,
                  o.CreatedAt,
                  i.Path AS Image, 
                  o.OrderID,
                  ts.StatusName,
                  th.Time AS StatusCreatedAt
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
              WHERE 
                  {placeholder} AND ts.StatusName = 'Hoàn tất'
              ORDER BY
                  th.Time DESC
          ) AS oo
      ) AS ranked_orders
      WHERE row_num = 1;
      `;
    const values : any = [userID];
    
    try {
      const resultGive: QueryResult = await client.query(query.replace('{placeholder}', `(o.UserGiveID = $1)`), values);
      const resultReceive: QueryResult = await client.query(query.replace('{placeholder}', `(o.UserReceiveID = $1)`), values);
      const mergedResults = {
        orderGive: resultGive.rows,
        orderReceive: resultReceive.rows
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
          th.Time DESC
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
    console.log('updateCompleteOrder')
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

}