import pool from '../../config/DatabaseConfig';

export class RatingManager {
  public constructor() {

  }

  public static async insertRating(userGiveID: string, orderID: string, rate: number) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO rate (userid, orderid, rated)
        VALUES ($1, $2, $3)
      `
      const values: any = [userGiveID, orderID, rate]
      const result: any = await client.query(query, values)

      return true
    } catch (error) {
      console.log(error)
      return false
    } finally {
      client.release();
    }
  }

  public static async getRating(userID: string) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT AVG(rated) AS average_rate, count(*) AS amount_rate
        FROM rate
        WHERE userid = ${userID}
      `
      const result: any = await client.query(query)

      return result.rows[0]
    } catch (error) {
      console.log(error)
      return []
    } finally {
      client.release();
    }
  }


}