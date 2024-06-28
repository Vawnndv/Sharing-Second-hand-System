import { QueryResult } from 'pg';
import pool from '../../config/DatabaseConfig';
import { Collaborator } from '../Collaborator';
import { Warehouse } from '../Warehouse';


export class WarehouseManager {
  public constructor() {

  }

  public viewCollaborators(warehouseID: string): Collaborator[] {
    // code here
    return [];
  }

  public getWarehouseInfomation(warehouseID: string): Warehouse {
    // code here
    return new Warehouse('');
  }

  public editWarehouse(warehouseID: string): boolean {
    // code here
    return true;
  }

  public static async viewAllWarehouse(): Promise<any[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM warehouse
        INNER JOIN address ON address.addressid = warehouse.addressid
        WHERE warehouse.isactivated = true
      `);
      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }

  public static async viewWarehouse(warehouseid: number): Promise<any[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`SELECT warehouseid, address.address, phonenumber, warehousename, warehouse.addressid, longitude, latitude, isactivated  FROM warehouse JOIN address ON warehouse.addressid = address.addressid WHERE warehouseid = $1`,[warehouseid]);
      if (result.rows.length === 0) {
        console.log('Không tìm thấy kho');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  } 

  public static async getWarehouseByUserID(userID: number): Promise<any[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT warehouse.warehouseid, address.address, phonenumber, warehousename, warehouse.addressid, longitude, latitude, isactivated  
        FROM warehouse 
        JOIN address ON warehouse.addressid = address.addressid 
        JOIN workat ON workat.warehouseid = warehouse.warehouseid
        WHERE workat.userid = 82
        `);
      if (result.rows.length === 0) {
        console.log('Không tìm thấy kho');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  } 

  public static async getAllWarehouseAllInfo(page: string, pageSize: string, whereClause: string, orderByClause: string): Promise<any[] | null> {
    const client = await pool.connect();

    const query = `
    SELECT 
      w.warehouseid,
      w.addressid,
      w.warehousename,
      w.avatar,
      w.phonenumber,
      w.createdat,
      w.isactivated,
      a.address,
      longitude,
      latitude,
        COUNT(WorkAt.UserID) AS NumberOfEmployees
    FROM 
        Warehouse w
    INNER JOIN address a ON a.addressid = w.addressid
    LEFT JOIN 
        WorkAt ON w.WarehouseID = WorkAt.WarehouseID
    ${whereClause}
    GROUP BY 
      w.warehouseid,
      w.addressid,
      w.warehousename,
      w.avatar,
      w.phonenumber,
      w.isactivated,
      a.address,
      longitude,
      latitude
    ${orderByClause}
     ` + ` LIMIT ${pageSize} OFFSET ${page} * ${pageSize}`;

    
    try {
      const result = await client.query(query);
      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async getWarehouseNameList(): Promise<any[] | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          warehouseid,
          warehousename
        FROM 
          Warehouse 
      `);

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  }

  public static async createWarehouse (phonenumber: string, warehouseName: string, warehouseLocation: any, avatar: string, isNewAddress: string): Promise<void> {

    const client = await pool.connect();

    const queryInsertAddress = `
      INSERT INTO "address" (address, latitude, longitude) 
      VALUES ('${warehouseLocation.address}', ${warehouseLocation.latitude}, ${warehouseLocation.longitude})
      RETURNING addressid;
    `
    const query = `
        INSERT INTO warehouse(warehousename, phonenumber, avatar, addressid, isactivated)
        VALUES($1, $2, $3, $4, true)
        RETURNING *;
      `;
    
    
    try {
      if(isNewAddress){
        const resultInsertAddress: QueryResult = await client.query(queryInsertAddress)
        
        const values : any = [warehouseName, phonenumber, avatar, resultInsertAddress.rows[0].addressid];
        const result: QueryResult = await client.query(query, values);
        return result.rows[0];
      }else{
        const values : any = [warehouseName, phonenumber, avatar, warehouseLocation.addressid];
        const result: QueryResult = await client.query(query, values);
        return result.rows[0];
      }
      
    } catch (error) {
      console.error('Error inserting warehouse:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };

  public static async updateWarehouseStatus (warehouseid: number, status: boolean){
    const client = await pool.connect();

      const updateWarehouseStatus = `
        UPDATE warehouse
        SET isActivated = ${status}
        WHERE warehouseid = ${warehouseid}
        RETURNING *;
      `
      try{
        const resultUpdateWarehouseStatus: QueryResult = await client.query(updateWarehouseStatus);
        return resultUpdateWarehouseStatus.rows[0];
      } catch (error) {
        console.error('Error updating warehouse status:', error);
      } finally {
        client.release(); // Release client sau khi sử dụng
      }
  }

  public static async updateWarehouse (phonenumber: string, warehousename: string, warehouseLocation: any, avatar: string, isNewAddress: string, warehouseid: string): Promise<void> {

    const client = await pool.connect();

    const queryInsertAddress = `
      INSERT INTO "address" (address, latitude, longitude) 
      VALUES ('${warehouseLocation.address}', ${warehouseLocation.latitude}, ${warehouseLocation.longitude})
      RETURNING addressid;
    `

    const updateWarehouseAddress = `
      UPDATE warehouse
      SET addressid = $1
      WHERE warehouseid = $2
      RETURNING *;
    `
    const updateWarehouseName = `
      UPDATE warehouse
      SET warehousename = '${warehousename}'
      WHERE warehouseid = $1
      RETURNING *;
    `

    const updateWarehousePhoneNumber = `
      UPDATE warehouse
      SET phonenumber = '${phonenumber}'
      WHERE warehouseid = $1
      RETURNING *;
      `

    const updateWarehouseAvatar = `
      UPDATE warehouse
      SET avatar = '${avatar}'
      WHERE warehouseid = $1
      RETURNING *;
      `
    
    
    try {
      if(isNewAddress){
        const resultInsertAddress: QueryResult = await client.query(queryInsertAddress)
        
        const values : any = [resultInsertAddress.rows[0].addressid, warehouseid];
        const result: QueryResult = await client.query(updateWarehouseAddress, values);
      }
      
      if(warehousename){
        const values : any = [warehouseid];
        const result: QueryResult = await client.query(updateWarehouseName, values);
      }

      if(phonenumber){
        const values : any = [warehouseid];
        const result: QueryResult = await client.query(updateWarehousePhoneNumber, values);
      }

      if(avatar){
        const values : any = [warehouseid];
        const result: QueryResult = await client.query(updateWarehouseAvatar, values);
        return result.rows[0];
      }
      
    } catch (error) {
      console.error('Error updating warehouse:', error);
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  };
}