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

  public static async insertReport(userID: string, postID: string, reportType: string, description: string, reporterID: string) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO report (userid, postid, reporttype, description, reporterid)
        VALUES ($1, $2, $3, $4, $5)
      `
      const values: any = [userID, postID, reportType, description, reporterID]
      const result: any = await client.query(query, values)

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}