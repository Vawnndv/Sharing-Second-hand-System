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
      const result = await client.query(`SELECT * FROM warehouse`);
      if (result.rows.length === 0) {
        return [];
      }
      console.log(result.rows);
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
      const result = await client.query(`SELECT * FROM warehouse WHERE warehouseid = $1`,[warehouseid]);
      if (result.rows.length === 0) {
        console.log('Không tìm thấy kho');
      }
      console.log(result.rows);
      return result.rows[0];
    } catch (error) {
      console.error('Lỗi khi truy vấn cơ sở dữ liệu:', error);
      throw error; // Ném lỗi để controller có thể xử lý
    } finally {
      client.release(); // Release client sau khi sử dụng
    }
  } 
}