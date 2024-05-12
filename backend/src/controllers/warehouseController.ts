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

export const getAllWarehousesAllInfo = asyncHandle(async (req, res) => {
  try {
    // Call the static method getAllItems to fetch all items from the database
    const warehouses = await WarehouseManager.getAllWarehouseAllInfo();
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

export const getWarehouse = asyncHandle(async (req, res) => {
  try {
    const warehouseid: number = parseInt(req.params.warehouseid);

    // Call the static method getAllItems to fetch all items from the database
    const warehouse = await WarehouseManager.viewWarehouse(warehouseid);
    // If items are found, return them as a response
    if (warehouse) {
      res.status(200).json({ message: 'Warehouses founded', wareHouse: warehouse });
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


