import pool from '../../config/DatabaseConfig';
import { Collaborator } from '../Collaborator';
import { UserManager } from './UserManager';


export class CollaboratorManager extends UserManager {

  public constructor() {
    super();
  }

  public viewByWarehouse(warehouseID: string): Collaborator[] {
    // code here
    return [];
  }

  
  public static async getAllCollaborators(page: string, pageSize: string, whereClause: string, orderByClause: string): Promise<any> {
    const client = await pool.connect()
  
    const query = `SELECT 
      u.userid, 
      u.dateofbirth AS dob, 
      u.email, 
      u.firstname, 
      u.lastname,
      u.phonenumber, 
      u.avatar,
      u.dateofbirth, 
      u.addressid, 
      u.createdat, 
      u.updatedat,
      u.isbanned,
      w.warehousename,
      w.warehouseid,
      a.address,
      a.longitude,
      a.latitude
    FROM public."User" u LEFT JOIN address a ON u.addressid = a.addressid LEFT JOIN workat wk ON u.userid = wk.userid LEFT JOIN warehouse w ON w.warehouseid = wk.warehouseid
    WHERE u.roleid = 2 AND u.email is not null`  + ` LIMIT ${pageSize} OFFSET ${page} * ${pageSize}`;

    try {
      const result = await client.query(query);
      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
      
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }
  

  public static async getCollaboratorsByWarehouse(warehouseID: string): Promise<any> {
    const client = await pool.connect()
  
    const query = `SELECT 
      u.userid,
      u.firstname, 
      u.lastname,
      u.avatar
    FROM public."User" u LEFT JOIN workat wk ON u.userid = wk.userid LEFT JOIN warehouse w ON w.warehouseid = wk.warehouseid
    WHERE w.warehouseid = ${warehouseID}
    `;

    try {
      const result = await client.query(query);
      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
      
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  
  public static async totalAllCollaborators(whereClause: string): Promise<any> {
    const client = await pool.connect()
    const query = 
    // 'SELECT COUNT(*) FROM users' + whereClause;
      `SELECT COUNT(*)::INTEGER AS total_users
      FROM public."User" u
      WHERE u.roleid = 2 AND u.email is not null` + whereClause;

    try {
      const result = await client.query(query);
      if (result.rows.length === 0) {
        return {total_users: 0};
      }

      return result.rows[0];
      
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }

  
  public static async adminBanCollaborator(userid: number, isBanned: boolean): Promise<any> {
    const client = await pool.connect();
    const query = `
      UPDATE "User"
      SET isbanned = $2
      WHERE userid = $1
    `;
    const values: any = [userid, isBanned];
    try {
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
    }
  };


  public static async adminDeleteCollaborator(userid: string): Promise<any> {
    const client = await pool.connect();


    const query = `
      UPDATE "User"
      SET email = null, password = ''
      WHERE userid = $1
    `;
    const values: any = [userid];
    try {
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
    }
  };

  public static async adminUpdateCollaborator(userid: number, firstname: string, lastname: string ,email: string, phonenumber: string, dob: string): Promise<any> {
    const client = await pool.connect();
    const query = `
      UPDATE "User"
      SET firstname = $2, lastname = $3, email =$4, phonenumber = $5, dateofbirth = $6
      WHERE userid = $1
      RETURNING *;
    `;
    const values: any = [userid, firstname, lastname, email, phonenumber, dob];
    try {
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
    }
  };

  public static async adminUpdateWarehouseWorkCollaborator(userid: number, warehouseid: number): Promise<any> {
    const client = await pool.connect();
    const query = `
      UPDATE "workat"
      SET warehouseid = $2
      WHERE userid = $1
      RETURNING *;
    `;
    const values: any = [userid, warehouseid];
    try {
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
    }
  };

  public static async adminCreateWarehouseWorkCollaborator(userid: number, warehouseid: number): Promise<any> {
    const client = await pool.connect();
    const query = `
      INSERT INTO public.workat(warehouseid, userid, position)
      VALUES ($1, $2, $3);
    `;
    const values: any = [warehouseid, userid, 'collaborator'];
    try {
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      client.release();
    }
  };

  public static async getWarehouseInfoOfCollaborator(userid: number): Promise<any> {
    const client = await pool.connect()
    const query = 'SELECT WAREHOUSE.addressid, WORKAT.warehouseid from WORKAT JOIN WAREHOUSE ON WORKAT.warehouseid = WAREHOUSE.warehouseid WHERE userid = $1';

    const value: any = [userid];

    try {
      const result = await client.query(query, value);
      return result.rows[0];
      
    } catch(error) {
      console.log(error);
      return null;
    } finally {
      client.release();
    }
  }
}

