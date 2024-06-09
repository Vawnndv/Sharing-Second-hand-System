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
    const { filterModel = {}, sortModel = [], page = 0, pageSize = 5 } = req.body;
    // console.log(filterModel)
    // Build WHERE clause based on filterModel (replace with your logic)
    let whereClause = '';
    if (filterModel.items && filterModel.items.length > 0) {
      whereClause = ' WHERE ';
      for (const filter of filterModel.items) {
        if (filter.operator === 'is' && filter.value) {
          whereClause += `w.${filter.field} is ${filter.value} OR `;
        } else if (filter.operator === 'contains') {
          // Add filtering conditions based on filter object properties
          whereClause += `w.${filter.field} LIKE '%${filter.value ? filter.value : ''}%' OR `;
        }
  
      }
      whereClause = whereClause.slice(0, -4); // Remove trailing 'OR'
    }
    let orderByClause = '';
    if (sortModel && sortModel.length > 0) {
      orderByClause = ' ORDER BY ';
      for (const sort of sortModel) {
        orderByClause += `w.${sort.field} ${sort.sort === 'asc' ? 'ASC' : 'DESC'}, `;
      }
      orderByClause = orderByClause.slice(0, -2); // Remove trailing comma and space
    }

    if (orderByClause === '') {
      orderByClause = ' ORDER BY createdat DESC ';
    }

  
    // Call the static method getAllItems to fetch all items from the database
    const warehouses = await WarehouseManager.getAllWarehouseAllInfo(page, pageSize, whereClause, orderByClause);
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
    res.status(200).json({ message: 'Update warehouse successfully', warehouseUpdated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi cập nhật kho:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const updateWarehouseStatus = asyncHandle(async (req, res) => {
  const warehouseid = req.body.warehouseid;
  const status = req.body.status;

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const warehouseUpdated = await WarehouseManager.updateWarehouseStatus(warehouseid, status);
    res.status(200).json({ message: 'Update warehouse status successfully', warehouseUpdated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi cập nhật trạng thái của kho:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});



export const getWarehouseNameList = asyncHandle(async (_req, res) => {
  try {
    const warehouseList = await WarehouseManager.getWarehouseNameList();
    // If items are found, return them as a response
    if (warehouseList) {
      res.status(200).json({ message: 'Get Warehouses Name List Successfully', data: { warehouseList } });
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



