/* eslint-disable prefer-template */
import React, { useEffect, useState } from 'react';

import axios from 'axios';


interface Warehouse {
  warehouseid: number;
  address: string;
  warehousename: string;
  longitude: string;
  latitude: string;
  numberofemployees: number;
  avatar: string;
}


export default function ManageWarehouse() {
  const [wareHouses, setWarehouses] = useState<Warehouse[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:3000/warehouse/getAllWarehousesAllInfo`)
        // const res = await postsAPI.HandlePost(
        //   `/${postID}`,
        // );
        if (!res) {
          throw new Error('Failed to fetch warehouses'); // Xử lý lỗi nếu request không thành công
        }
        // const count = res.data.wareHouses.length;
        // // eslint-disable-next-line prefer-const
        // let warehouseArray = [];
        // let temp = ''
        // for(let i = 0; i< count; i += 1){
        //   temp = '  ' + res.data.wareHouses[i].warehousename + ', ' + res.data.wareHouses[i].address;
        //   warehouseArray.push({
        //     value: temp,
        //     label: temp
        //   })
        // }
        console.log('AAaA',res.data.wareHouses);
        setWarehouses(res.data.wareHouses); // Cập nhật state với dữ liệu nhận được từ API

      } catch (error) {
        console.error('Error fetching warehouses:', error);
      } finally {
        setIsLoading(false);
      }
  }
  fetchWarehouses();
  },[])

  return (
    <div className="warehouse-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Longitude</th>
              <th>Latitude</th>
              <th>Employees</th>
              <th>Avatar</th>


            </tr>
          </thead>
          <tbody>
            {wareHouses.map((warehouse) => (
              <tr key={warehouse.warehouseid}>
                <td>{warehouse.warehouseid}</td>
                <td>{warehouse.warehousename}</td>
                <td>{warehouse.address}</td>
                <td>{warehouse.longitude}</td>
                <td>{warehouse.latitude}</td>
                <td>{warehouse.numberofemployees}</td>
                <td>{warehouse.avatar}</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )

}
