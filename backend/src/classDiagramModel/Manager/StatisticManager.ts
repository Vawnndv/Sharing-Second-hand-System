
import { QueryResult } from 'pg';
import dayjs, { Dayjs } from 'dayjs';
import pool from '../../config/DatabaseConfig'
import { Warehouse } from '../Warehouse';

const category = [
  "Quần áo",
  "Giày dép",
  "Đồ nội thất",
  "Công cụ",
  "Dụng cụ học tập",
  "Thể thao",
  "Công nghệ",
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
  

  public static async statisticImportExport(userID: string | undefined, type: string | undefined, timeStart: string, timeEnd: string): Promise<any[] | undefined>{
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
        AND DATE(o.updatedat) = $2
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
        AND DATE(o.updatedat) = $2
      `
    // const results = []
    // if(type === 'import'){
    //   for(let i = 0; i < category.length; i+=1){
    //     const result : QueryResult = await client.query(queryImport, [category[i]]);
    //     results.push({
    //       label: category[i],
    //       quantity: result.rows[0].quantity
    //     })
    //   }
    // }else{
    //   for(let i = 0; i < category.length; i+=1){
    //     const result : QueryResult = await client.query(queryExport, [category[i]]);
    //     results.push({
    //       label: category[i],
    //       quantity: result.rows[0].quantity
    //     })
    //   }
    // }

    // return results

    const dateStart = dayjs(timeStart)
    const dateEnd = dayjs(timeEnd)
    let currentDateBrow = dayjs(timeStart)
    const daysDiff = dateEnd.diff(dateStart, 'day')
    
    const finalResults: any = []
    if(type === 'import'){
      for(let i = 0; i < category.length; i+=1){
        let results = [];
        const resultStart : QueryResult = await client.query(queryImport, [category[i], timeStart]);
        results.push({
          label: dateStart.format('MMMM DD, YYYY'),
          quantity: resultStart.rows[0].quantity
        })
        currentDateBrow = dayjs(timeStart)
        for(let j = 1; j < daysDiff + 1 ; j+=1){
          currentDateBrow = currentDateBrow.add(1, 'day')
   
          const result : QueryResult = await client.query(queryImport, [category[i], `${currentDateBrow.year()}-${currentDateBrow.month() + 1}-${currentDateBrow.date()}`]);
          results.push({
            label: currentDateBrow.format('MMMM DD, YYYY'),
            quantity: result.rows[0].quantity
          })
        }
        const resultEnd : QueryResult = await client.query(queryImport, [category[i], timeEnd]);
        results.push({
          label: dateEnd.format('MMMM DD, YYYY'),
          quantity: resultEnd.rows[0].quantity
        })
        
        finalResults.push({
          label: category[i],
          data: {
            results
          }
        })
        
      }
      
    }else{
      for(let i = 0; i < category.length; i+=1){
        let results = [];
        const resultStart : QueryResult = await client.query(queryExport, [category[i], timeStart]);
        results.push({
          label: dateStart.format('MMMM DD, YYYY'),
          quantity: resultStart.rows[0].quantity
        })
        currentDateBrow = dayjs(timeStart)
        for(let j = 1; j < daysDiff + 1 ; j+=1){
          currentDateBrow = currentDateBrow.add(1, 'day')
   
          const result : QueryResult = await client.query(queryExport, [category[i], `${currentDateBrow.year()}-${currentDateBrow.month() + 1}-${currentDateBrow.date()}`]);
          results.push({
            label: currentDateBrow.format('MMMM DD, YYYY'),
            quantity: result.rows[0].quantity
          })
        }
        const resultEnd : QueryResult = await client.query(queryExport, [category[i], timeEnd]);
        results.push({
          label: dateEnd.format('MMMM DD, YYYY'),
          quantity: resultEnd.rows[0].quantity
        })
        
        finalResults.push({
          label: category[i],
          data: {
            results
          }
        })
      }
    }

    return finalResults
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
      WITH input_quantity AS (
        SELECT 
            CASE
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
    ),
    output_quantity AS (
        SELECT 
            CASE
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
    )
    SELECT 
        input_quantity.quantity - output_quantity.quantity AS quantity
    FROM 
        input_quantity, output_quantity;
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

  public static async statisticAccessUser(type: string, timeStart: string | undefined, timeEnd: string | undefined): Promise<any[] | undefined>{
    const client = await pool.connect()

    try{
      let typeQuery = `accessanalytic`
      if(type !== 'access'){
        typeQuery = `postanalytic`
      }
      const query = `
      SELECT COUNT(*) as quantity
      FROM ${typeQuery} 
      WHERE DATE(createdat) = $1;
      `
      const dateStart = dayjs(timeStart)
      const dateEnd = dayjs(timeEnd)
      let currentDateBrow = dayjs(timeStart)
      const daysDiff = dateEnd.diff(dateStart, 'day')

      let results =[]
      
      for(let i = 0; i < daysDiff + 1; i++){
        
        const result : QueryResult = await client.query(query, [`${currentDateBrow.year()}-${currentDateBrow.month() + 1}-${currentDateBrow.date()}`]);
        results.push({
          label: currentDateBrow.format('dddd - MMMM DD, YYYY'),
          quantity: result.rows[0].quantity
        })
        currentDateBrow = currentDateBrow.add(1, 'day')
      }
      
      return results;
    }catch(error){
      console.log(error)
      return []
    }finally{
      client.release()
    }
  }

  public static async statisticImportExportAdmin(type: string | undefined, warehouses: any, timeStart: string, timeEnd: string): Promise<any[] | undefined>{
    const client = await pool.connect()

    try{

      // let queryWarehouseImport = ``
      // warehouses.map((warehouse: any, index: number) => {
      //   queryWarehouseImport += `ic.warehouseid = ${warehouse.warehouseid} `
      //   if(index < warehouses.length - 1){
      //     queryWarehouseImport += `OR `
      //   }
      // })
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
        WHERE ic.warehouseid = $2
      ) AND it.nametype = $1
        AND o.updatedat <= '${timeEnd}'
        AND o.updatedat >= '${timeStart}'
      `

      // let queryWarehouseExport = ``
      // warehouses.map((warehouse: any, index: number) => {
      //   queryWarehouseExport += `oc.warehouseid = ${warehouse.warehouseid} `
      //   if(index < warehouses.length - 1){
      //     queryWarehouseExport += `OR `
      //   }
      // })
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
        WHERE oc.warehouseid = $2
      ) AND it.nametype = $1
        AND o.updatedat <= '${timeEnd}'
        AND o.updatedat >= '${timeStart}'
      `
    const finalResults = []
    if(type === 'import'){
      for(let i = 0; i < warehouses.length; i+=1){
        let results = [];
        for(let j = 0; j < category.length; j+=1){
          const result : QueryResult = await client.query(queryImport, [category[j], warehouses[i].warehouseid]);
          results.push({
            label: category[j],
            quantity: result.rows[0].quantity
          })
        }
        finalResults.push({
          warehousename: warehouses[i].warehousename,
          data: {
            results
          }
        })
      }
      
    }else{
      for(let i = 0; i < warehouses.length; i+=1){
        let results = [];
        for(let j = 0; j < category.length; j+=1){
          const result : QueryResult = await client.query(queryExport, [category[j], warehouses[i].warehouseid]);
          results.push({
            label: category[j],
            quantity: result.rows[0].quantity
          })
        }
        finalResults.push({
          warehousename: warehouses[i].warehousename,
          data: {
            results
          }
        })
      }
    }

    return finalResults
    }catch(error){
      console.log(error)
      return []
    }finally{
      client.release()
    }
  }

  public static async statisticImportExportFollowTimeAdmin(type: string | undefined,category: string, warehouses: any, timeStart: string, timeEnd: string): Promise<any[] | undefined>{
    const client = await pool.connect()

    try{

      // let queryWarehouseImport = ``
      // warehouses.map((warehouse: any, index: number) => {
      //   queryWarehouseImport += `ic.warehouseid = ${warehouse.warehouseid} `
      //   if(index < warehouses.length - 1){
      //     queryWarehouseImport += `OR `
      //   }
      // })
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
        WHERE ic.warehouseid = $2
      ) AND it.nametype = $1
        AND DATE(o.updatedat) = $3
      `

      // let queryWarehouseExport = ``
      // warehouses.map((warehouse: any, index: number) => {
      //   queryWarehouseExport += `oc.warehouseid = ${warehouse.warehouseid} `
      //   if(index < warehouses.length - 1){
      //     queryWarehouseExport += `OR `
      //   }
      // })
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
        WHERE oc.warehouseid = $2
      ) AND it.nametype = $1
        AND DATE(o.updatedat) = $3
      `
    const dateStart = dayjs(timeStart)
    const dateEnd = dayjs(timeEnd)
    let currentDateBrow = dayjs(timeStart)
    const daysDiff = dateEnd.diff(dateStart, 'day')
    
    const finalResults = []
    if(type === 'import'){
      for(let i = 0; i < warehouses.length; i+=1){
        let results = [];
        const resultStart : QueryResult = await client.query(queryImport, [category, warehouses[i].warehouseid, timeStart]);
        results.push({
          label: dateStart.format('MMMM DD, YYYY'),
          quantity: resultStart.rows[0].quantity
        })
        currentDateBrow = dayjs(timeStart)
        for(let j = 1; j < daysDiff ; j+=1){
          currentDateBrow = currentDateBrow.add(1, 'day')
       
          const result : QueryResult = await client.query(queryImport, [category, warehouses[i].warehouseid, `${currentDateBrow.year()}-${currentDateBrow.month() + 1}-${currentDateBrow.date()}`]);
          results.push({
            label: currentDateBrow.format('MMMM DD, YYYY'),
            quantity: result.rows[0].quantity
          })
        }
        const resultEnd : QueryResult = await client.query(queryImport, [category, warehouses[i].warehouseid, timeEnd]);
        results.push({
          label: dateEnd.format('MMMM DD, YYYY'),
          quantity: resultEnd.rows[0].quantity
        })
        
        finalResults.push({
          warehousename: warehouses[i].warehousename,
          data: {
            results
          }
        })
      }
      
    }else{
      for(let i = 0; i < warehouses.length; i+=1){
        let results = [];
        const resultStart : QueryResult = await client.query(queryExport, [category, warehouses[i].warehouseid, timeStart]);
        results.push({
          label: dateStart.format('MMMM DD, YYYY'),
          quantity: resultStart.rows[0].quantity
        })
        currentDateBrow = dayjs(timeStart)
        for(let j = 1; j < daysDiff ; j += 1){
          currentDateBrow = currentDateBrow.add(1, 'day')
          const result : QueryResult = await client.query(queryExport, [category, warehouses[i].warehouseid, `${currentDateBrow.year()}-${currentDateBrow.month() + 1}-${currentDateBrow.date()}`]);
          results.push({
            label: currentDateBrow.format('MMMM DD, YYYY'),
            quantity: result.rows[0].quantity
          })
        }
        const resultEnd : QueryResult = await client.query(queryExport, [category, warehouses[i].warehouseid, timeEnd]);
        results.push({
          label: dateEnd.format('MMMM DD, YYYY'),
          quantity: resultEnd.rows[0].quantity
        })
        
        finalResults.push({
          warehousename: warehouses[i].warehousename,
          data: {
            results
          }
        })
      }
    }

    return finalResults
    }catch(error){
      console.log(error)
      return []
    }finally{
      client.release()
    }
  }

  public static async statisticInventoryAdmin(warehouses: any): Promise<any[] | undefined>{
    const client = await pool.connect()

    try{


      const query = `
      WITH input_quantity AS (
        SELECT 
            CASE
                WHEN sum(i.quantity) IS NULL THEN 0
                ELSE sum(i.quantity)
            END AS quantity
        FROM "orders" o
        JOIN "item" i ON o.itemid = i.itemid
        JOIN "item_type" it ON i.itemtypeid = it.itemtypeid 
        WHERE o.orderid IN (
            SELECT ic.orderid FROM "inputcard" ic
            WHERE ic.warehouseid = $2
        ) AND it.nametype = $1
    ),
    output_quantity AS (
        SELECT 
            CASE
                WHEN sum(i.quantity) IS NULL THEN 0
                ELSE sum(i.quantity)
            END AS quantity
        FROM "orders" o
        JOIN "item" i ON o.itemid = i.itemid
        JOIN "item_type" it ON i.itemtypeid = it.itemtypeid 
        WHERE o.orderid IN (
            SELECT oc.orderid FROM "outputcard" oc
            WHERE oc.warehouseid = $2
        ) AND it.nametype = $1
    )
    SELECT 
        input_quantity.quantity - output_quantity.quantity AS quantity
    FROM 
        input_quantity, output_quantity;
      `
    const finalResults = []
    
    // for(let i = 0; i < category.length; i+=1){
    //   const result : QueryResult = await client.query(query, [category[i]]);
    //   results.push({
    //     label: category[i],
    //     quantity: result.rows[0].quantity
    //   })
    // }

    for(let i = 0; i < warehouses.length; i+=1){
      let results = [];
      for(let j = 0; j < category.length; j+=1){
        const result : QueryResult = await client.query(query, [category[j], warehouses[i].warehouseid]);
        results.push({
          label: category[j],
          quantity: result.rows[0].quantity
        })
      }
      finalResults.push({
        warehousename: warehouses[i].warehousename,
        data: {
          results
        }
      })
    }
    

    return finalResults
    }catch(error){
      console.log(error)
      return []
    }finally{
      client.release()
    }
  }

  public static async statisticAccessUserAdmin(timeValue: number, warehouses: any[] ): Promise<any[] | undefined>{
    const client = await pool.connect()

    try{
      const query = `
      SELECT count(userid) as quantity
      FROM "User"
      WHERE createdat <= $1 AND roleid = '1'
      `
      const timeArr = [
        {
            value: 1,
            label: '1 tháng'
        },
        {
            value: 2,
            label: '2 tháng'
        },
        {
            value: 3,
            label: '3 tháng'
        },
        {
            value: 6,
            label: '6 tháng'
        },
        {
            value: 12,
            label: '1 năm'
        },
        {
            value: 24,
            label: '2 năm'
        },
        {
            value: 60,
            label: '5 năm'
        }
      ]
      const index = timeArr.findIndex(item => item.value === timeValue);
      
      
      const currentDate = new Date();

      // Tính toán ngày bắt đầu của tháng hiện tại
      const startOfMonth = currentDate
      startOfMonth.setMonth(currentDate.getMonth() - timeValue)

      // Tính toán các ngày cách đều trong tháng
      const evenlySpacedDates = [];
      for (let i: number = 0; i < (13 + 13*index); i += 1 ) {
        const evenlySpacedDate = new Date(startOfMonth);
        evenlySpacedDate.setDate(startOfMonth.getDate() + (i * Math.floor((30*timeValue) / (13 + 13*index)))); // Sử dụng 30 làm giá trị xấp xỉ cho số ngày trong một tháng
        evenlySpacedDates.push(evenlySpacedDate);
      }

      const finalResults = []

      for(let i = 0; i < warehouses.length; i+=1){
        const results: any = []
        for(let j = 0; j < evenlySpacedDates.length; j++){
          const specificDate = evenlySpacedDates[j].getFullYear() + '-' + (evenlySpacedDates[j].getMonth() + 1) + '-' + evenlySpacedDates[j].getDate()
      
          const result : QueryResult = await client.query(query, [specificDate]);
          results.push({
            label: `${evenlySpacedDates[j].toLocaleString('en', { month: 'long'})} ${evenlySpacedDates[j].getDate()}, ${evenlySpacedDates[j].getFullYear()}`,
            quantity: result.rows[0].quantity
          })
        }
        finalResults.push({
          warehousename: warehouses[i].warehousename,
          data: {
            results
          }
        })
      }
      

      
      
      
      return finalResults;
    }catch(error){
      console.log(error)
      return []
    }finally{
      client.release()
    }
  }

  public static async insertAnalytic(type: string | undefined): Promise<Boolean> {
    const client = await pool.connect()

    try{
      let query = ``
      if(type === 'access'){
        query = `
          INSERT INTO accessanalytic DEFAULT VALUES
        `
      }else{
        query = `
          INSERT INTO postanalytic DEFAULT VALUES
        `
      }

      const result = await client.query(query)
      return true;

    }catch(error){
      console.log(error)
      return false
    }finally{
      client.release()
    }
  }
}



