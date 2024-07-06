import pool from "../../config/DatabaseConfig"
export class MapManager {
  public constructor() {

  }

  public showMap(): void {
    // code here
  }

  public setLocation(lng: number, lat: number): void {
    // code here
  }

  public searchLocation(textSearch: string): Location[] {
    // code here
    return [];
  }

  public async setUserLocation(userID: string, latitude: string, longitude: string, address: string): Promise<boolean> {

    const client = await pool.connect();

    const queryAddressID =`
      SELECT addressid
      FROM "User"
      WHERE userid = ${userID}`

    const queryUpdateAddress=`
      UPDATE "address"
      SET address='${address}', latitude='${latitude}', longitude='${longitude}'
      WHERE addressid = $1
    `
    const queryInsertAdress=`
      INSERT INTO "address" (address, latitude, longitude)
      VALUES ('${address}','${latitude}','${longitude}')
      RETURNING addressid 
    `

    const queryUpdateAddressIDForUser =`
      UPDATE "User"
      SET addressid=$1
      WHERE userid = ${userID}
    `

    try {
      const resultAddressID = await client.query(queryAddressID)
      const addressid = (resultAddressID).rows[0].addressid
      if(addressid !== null){
        const resultUpdateAddress = await client.query(queryUpdateAddress,[addressid])

      }else {
        const resultInsertAddress = await client.query(queryInsertAdress)
        const newAddressID = resultInsertAddress.rows[0].addressid
        const resultUpdateAddressIDForUser = await client.query(queryUpdateAddressIDForUser,[newAddressID])
      }
    } catch (error) {
      console.log(error)
      return false
    }
    return true
  }
}