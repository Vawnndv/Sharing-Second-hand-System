import pool from '../../config/DatabaseConfig';
import { Report } from '../Report';

export class ReportManager {
  public constructor() {

  }

  public createReport(senderId: string, receiverId: string, description: string, createAt: string): Report {
    return new Report(senderId, receiverId, description, createAt);
  }

  public send(report: Report): void {
    //code here
  }

  public static async insertReport(userID: string, postID: string, reportType: string, description: string, reporterID: string, warehouseID: string): Promise<Boolean> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO report (userid, postid, reporttype, description, reporterid, warehouseid)
        VALUES ($1, $2, $3, $4, $5, $6)
      `
      const values: any = [userID, postID, reportType, description, reporterID, warehouseID]
      const result: any = await client.query(query, values)

      return true
    } catch (error) {
      console.log(error)
      return false
    } finally {
      client.release();
    }
  }

  public static async getUserReports(): Promise<any> {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          u.firstname,
          u.lastname,
          u.avatar,
          r.*
        FROM report r
        JOIN "User" u ON u.userid = r.reporterid
        WHERE r.reporttype = '1' AND r.approvedate IS NULL
        ORDER BY r.createdat DESC 
      `
      const result: any = await client.query(query)

      return result.rows
    } catch (error) {
      console.log(error)
      return false
    } finally {
      client.release();
    }
  }

  public static async getPostReports(userID: string) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          u.firstname,
          u.lastname,
          u.avatar,
          r.*
        FROM report r
        JOIN "User" u ON u.userid = r.reporterid
        WHERE r.reporttype = '2' AND r.approvedate IS NULL
          AND r.warehouseid = (
            SELECT wk.warehouseid
            FROM workat wk
            WHERE wk.userid = ${userID}
          )
        ORDER BY r.createdat DESC 
      `
      const result: any = await client.query(query)

      return result.rows
    } catch (error) {
      console.log(error)
      return false
    } finally {
      client.release();
    }
  }

  public static async updateReport(reportID: string): Promise<Boolean> {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE report
        SET approvedate = CURRENT_DATE
        WHERE reportid = $1;
      `
      const values: any = [reportID]
      const result: any = await client.query(query, values)
      return true
    } catch (error) {
      console.log(error)
      return false
    } finally {
      client.release();
    }
  }

}