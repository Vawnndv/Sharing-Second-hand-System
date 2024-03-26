import { Order } from '../Order';
import pool from '../../config/DatabaseConfig';
import { QueryResult } from 'pg';

export class OrderManager {
  public constructor() {

  }

  public createOrder(orderID: string): boolean {
    // code here
    return true;
  }

  public showOrders(userID: string): Order[] {
    // code here
    return [];
  }

  public getOrderDetails(orderID: string): Order {
    // code here
    return new Order('');
  }

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
    } 
  };
}