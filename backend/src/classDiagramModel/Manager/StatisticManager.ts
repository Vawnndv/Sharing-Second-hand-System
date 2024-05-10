
import { QueryResult } from 'pg';
import pool from '../../config/DatabaseConfig'

const category = [
  "Quần áo",
  "Giày dép",
  "Đồ nội thất",
  "Công cụ",
  "Dụng cụ học tập",
  "Thể thao",
  "Khác"
]
export class StatisticManager {
  public constructor() {

  }

  public statistic(data: string, type: string): void {
    // code here
  }

  public static async statisticOrderCollab(userID: string | undefined, time: string | undefined): Promise<Number[] | undefined>{
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
                AND p.timeend >= NOW() - INTERVAL '${time}'
            ) 
            AND o.status = 'Chờ cộng tác viên lấy hàng'
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
              AND p.timeend >= NOW() - INTERVAL '${time}'
          ) 
          AND o.status = 'Hàng đã nhập kho'
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
  

  public static async statisticImportExport(userID: string | undefined, type: string | undefined): Promise<any[] | undefined>{
    const client = await pool.connect()

    try{
      const queryImport = `
      SELECT CASE
        WHEN sum(i.quantity) IS NULL THEN 0
        ELSE sum(i.quantity)
        END AS quantity
      FROM "orders" o
      JOIN "item" i ON o.itemid = i.itemid
      JOIN "item_type" it ON i.itemtypeid = it.itemtypeid 
      WHERE o.orderid IN (
        SELECT ic.orderid FROM "inputcard" ic
        WHERE ic.warehouseid = (
        SELECT w.warehouseid FROM "workat" w
        WHERE ${userID} = w.userid
        )
      ) AND it.nametype = $1
      `
      const queryExport = `
      SELECT CASE
        WHEN sum(i.quantity) IS NULL THEN 0
        ELSE sum(i.quantity)
        END AS quantity
      FROM "orders" o
      JOIN "item" i ON o.itemid = i.itemid
      JOIN "item_type" it ON i.itemtypeid = it.itemtypeid 
      WHERE o.orderid IN (
        SELECT oc.orderid FROM "outputcard" oc
        WHERE oc.warehouseid = (
        SELECT w.warehouseid FROM "workat" w
        WHERE ${userID} = w.userid
        )
      ) AND it.nametype = $1
      `
    const results = []
    if(type === 'import'){
      for(let i = 0; i < category.length; i+=1){
        const result : QueryResult = await client.query(queryImport, [category[i]]);
        results.push({
          label: category[i],
          quantity: result.rows[0].quantity
        })
      }
    }else{
      for(let i = 0; i < category.length; i+=1){
        const result : QueryResult = await client.query(queryExport, [category[i]]);
        results.push({
          label: category[i],
          quantity: result.rows[0].quantity
        })
      }
    }

    return results
    }catch(error){
      console.log(error)
      return []
    }finally{
      client.release()
    }
  }

  public static async statisticInventory(userID: string | undefined): Promise<any[] | undefined>{
    const client = await pool.connect()

    try{
      const query = `
      SELECT CASE
        WHEN sum(i.quantity) IS NULL THEN 0
        ELSE sum(i.quantity)
        END AS quantity
      FROM "orders" o
      JOIN "item" i ON o.itemid = i.itemid
      JOIN "item_type" it ON i.itemtypeid = it.itemtypeid 
      WHERE o.orderid IN (
        SELECT ic.orderid FROM "inputcard" ic
        WHERE ic.warehouseid = (
        SELECT w.warehouseid FROM "workat" w
        WHERE ${userID} = w.userid
        )
      ) AND it.nametype = $1 AND o.status='Hàng đã nhập kho'
      `
    const results = []
    
    for(let i = 0; i < category.length; i+=1){
      const result : QueryResult = await client.query(query, [category[i]]);
      results.push({
        label: category[i],
        quantity: result.rows[0].quantity
      })
    }
    

    return results
    }catch(error){
      console.log(error)
      return []
    }finally{
      client.release()
    }
  }
}