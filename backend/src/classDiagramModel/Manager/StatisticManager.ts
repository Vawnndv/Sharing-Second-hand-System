
import { QueryResult } from 'pg';
import pool from '../../config/DatabaseConfig'
export class StatisticManager {
  public constructor() {

  }

  public statistic(data: string, type: string): void {
    // code here
  }

  public static async statisticOrderCollab(userID: string | undefined): Promise<Number[] | undefined>{
    const client = await pool.connect();

    try{
        const queryOrderCount = `
        SELECT
          (SELECT COUNT(*) 
          FROM "orders" o
          WHERE o.orderid IN (
              SELECT ic.orderid 
              FROM "inputcard" ic
              WHERE ic.warehouseid = (
                  SELECT w.warehouseid 
                  FROM "workat" w
                  WHERE $1 = w.userid
              )
          ) 
          AND EXISTS (
              SELECT 1
              FROM "posts" p
              WHERE p.postid = o.postid
              AND CURRENT_DATE BETWEEN p.timestart AND p.timeend
          ) 
          AND o.status = 'Pending'
          ) AS order_pending_count,
          (SELECT COUNT(*) 
          FROM "orders" o
          WHERE o.orderid IN (
              SELECT ic.orderid 
              FROM "inputcard" ic
              WHERE ic.warehouseid = (
                  SELECT w.warehouseid 
                  FROM "workat" w
                  WHERE $1 = w.userid
              )
          ) 
          AND EXISTS (
              SELECT 1
              FROM "posts" p
              WHERE p.postid = o.postid
              AND CURRENT_DATE BETWEEN p.timestart AND p.timeend
          ) 
          AND o.status = 'Completed'
          ) AS order_completed_count;
        `

        const values: any = [userID];
        const result : QueryResult = await client.query(queryOrderCount, values);
        const row = result.rows[0];
        return [parseInt(row.order_pending_count), parseInt(row.order_completed_count)]
    }catch(error){
      []
    }finally{
      client.release()
    }
  }
}