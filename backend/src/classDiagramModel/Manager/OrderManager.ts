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


export class OrderManager {
  public constructor() {

  }

  public createOrder(orderID: number, title: string, receiverId: number, giverId: number,
    orderCode: string, qrCode: string, status: string, location: string, description: string,
    time: string, itemID: number, departure: string, item: Item, trace: Trace, currentStatus: Status): boolean {
    // code here
    return true;
  }

  public static async showOrders(userID: string | undefined, type: string | undefined): Promise<Order[]> {
    // code here
    const client = await pool.connect();

    try {
      const ordersQuery = `
          SELECT o.* FROM "orders" o
          WHERE o.orderid IN (
            SELECT ic.orderid FROM "inputcard" ic
            WHERE ic.warehouseid = (
              SELECT w.warehouseid FROM "workat" w
              WHERE $1 = w.userid
            )
          ) AND o.status = $2
          AND EXISTS (
            SELECT 1
            FROM "posts" p
            WHERE p.postid = o.postid
            AND CURRENT_DATE BETWEEN p.timestart AND p.timeend
          )`;

      const values: any = [userID,type]
  
      const ordersResult: QueryResult = await client.query(ordersQuery, values);
      
      const ordersRow = ordersResult.rows;
  
      const orders = await Promise.all(ordersRow.map(async (row: any) => {
        const giver: User | undefined = await UserManager.getUser(row.usergiveid);
        const receive: User | undefined = await UserManager.getUser(row.userreceiveid);
        const item: Item | null = await ItemManager.viewDetailsItem(row.itemid);
        return new Order(
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
          null
        );
      }));

      // console.log(orders)
      return orders;
    }catch (error) {
      console.log('error:', error);
      return [];
    } finally {
      client.release();
    }
  }

  public static async showOrdersOnWeek(userID: string | undefined): Promise<Order[]> {
    // code here
    const client = await pool.connect();

    try {
      const ordersQuery = `
          SELECT o.* FROM "orders" o
          WHERE o.orderid IN (
            SELECT ic.orderid FROM "inputcard" ic
            WHERE ic.warehouseid = (
              SELECT w.warehouseid FROM "workat" w
              WHERE $1 = w.userid
            )
          )
          AND o.time >= NOW() - INTERVAL '1 week'
          AND EXISTS (
            SELECT 1
            FROM "posts" p
            WHERE p.postid = o.postid
            AND CURRENT_DATE BETWEEN p.timestart AND p.timeend
          )`;

      const values: any = [userID]
  
      const ordersResult: QueryResult = await client.query(ordersQuery, values);
      
      const ordersRow = ordersResult.rows;
  
      const orders = await Promise.all(ordersRow.map(async (row: any) => {
        const giver: User | undefined = await UserManager.getUser(row.usergiveid);
        const receive: User | undefined = await UserManager.getUser(row.userreceiveid);
        const item: Item | null = await ItemManager.viewDetailsItem(row.itemid);
        return new Order(
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
          null
        );
      }));

      // console.log(orders)
      return orders;
    }catch (error) {
      console.log('error:', error);
      return [];
    } finally {
      client.release();
    }
  }

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
      const receive: User | undefined = await UserManager.getUser(ordersRow.userreceiveid);
      const item: Item | null = await ItemManager.viewDetailsItem(ordersRow.itemid);
      const post: Post | null = await PostManager.getDetailsPost(ordersRow.postid);

      const queryImageItem = `
        SELECT path FROM "image" 
        WHERE itemid = $1
      `
      const path = await client.query(queryImageItem, [ordersRow.itemid])
      
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
          post
        ),
        image: path.rows[0].path
      }];
      

      // console.log(orders)
    }catch (error) {
      console.log('error:', error);
      return null;
    } finally {
      client.release();
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

  public static async updateStatusOrder (orderID: string) : Promise<boolean> {
    console.log('updateStatusOrder')
    const client = await pool.connect()

    try{
      const query = `
        UPDATE "orders"
        SET status = 'Completed'
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

}