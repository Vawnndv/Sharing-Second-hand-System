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


export const createWarehouse = asyncHandle(async (req, res) => {
  const warehouseName = req.body.warehouseName;
  const phonenumber = req.body.phonenumber;
  const avatar = req.body.avatar;
  const warehouseLocation = req.body.warehouseLocation;
  const isNewAddress = req.body.isNewAddress;
  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const warehouseCreated = await WarehouseManager.createWarehouse(phonenumber, warehouseName, warehouseLocation, avatar, isNewAddress);
    res.status(200).json({ message: 'Create warehouse successfully', warehouseCreated: warehouseCreated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi tạo kho:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});


export const updateWarehouse = asyncHandle(async (req, res) => {
  const warehouseName = req.body.warehouseName;
  const phonenumber = req.body.phonenumber;
  const avatar = req.body.avatar;
  const warehouseLocation = req.body.warehouseLocation;
  const isNewAddress = req.body.isNewAddress;
  const warehouseid = req.body.warehouseid;
  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const warehouseUpdated = await WarehouseManager.updateWarehouse(phonenumber, warehouseName, warehouseLocation, avatar, isNewAddress, warehouseid);
    res.status(200).json({ message: 'Update warehouse successfully' });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi cập nhật kho:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});


