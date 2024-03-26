import { Item } from '../Item';
import { Order } from '../Order';
import { Status } from '../Status';
import { Trace } from '../Trace';
import pool from "../../config/DatabaseConfig"
import { QueryResult } from 'pg';
import { UserManager } from './UserManager';
import { User } from '../User';
import { ItemManager } from './ItemManager';

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
      
      const ordersRows = ordersResult.rows;
  
      const orders = await Promise.all(ordersRows.map(async (row: any) => {
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
          row.departure
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

  // public getOrderDetails(orderID: string): Order {
  //   // code here
  //   return new Order('');
  // }
}