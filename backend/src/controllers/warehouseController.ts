import { WarehouseManager } from '../classDiagramModel/Manager/WarehouseManager';
import asyncHandle from 'express-async-handler';


export const getAllWarehouses = asyncHandle(async (req, res) => {
  try {
    // Call the static method getAllItems to fetch all items from the database
    const warehouses = await WarehouseManager.viewAllWarehouse();
    // If items are found, return them as a response
    if (warehouses) {
      res.status(200).json({ message: 'Warehouses founded', wareHouses: warehouses });
    } else {
      // If no items are found, return an empty array
      res.status(200).json([]);
    }
  } catch (error) {
    // If there's an error, return a 500 error
    console.error('Error retrieving warehouses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


