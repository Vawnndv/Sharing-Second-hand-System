
import { Admin } from '../classDiagramModel/Admin';
import asyncHandle from 'express-async-handler';


export const getAllWarehouses = asyncHandle(async (req, res) => {
  try {
    // Call the static method getAllItems to fetch all items from the database
    const warehouses = await Admin.warehouseManager.viewAllWarehouse();
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

export const getAllWarehousesAdmin = asyncHandle(async (req, res) => {
  try {
    // Call the static method getAllItems to fetch all items from the database
    const warehouses = await Admin.warehouseManager.viewAllWarehouseAdmin();
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
    // Build WHERE clause based on filterModel (replace with your logic)
    let whereClause = '';
    let havingClause = '';
    if (filterModel.items && filterModel.items.length > 0) {
      whereClause = ' WHERE ';
      for (const filter of filterModel.items) {
        if (filter.field !== 'numberofemployees' && filter.field !== 'address') {
          if (filter.operator === 'is' && filter.value) {
            whereClause += `w.${filter.field} is ${filter.value} OR `;
          } else if (filter.operator === 'contains') {
            // Add filtering conditions based on filter object properties
            whereClause += `w.${filter.field} LIKE '%${filter.value ? filter.value : ''}%' OR `;
          }
        } else if (filter.field === 'address') {
          if (filter.operator === 'is' && filter.value) {
            whereClause += `a.address is ${filter.value} OR `;
          } else if (filter.operator === 'contains') {
            // Add filtering conditions based on filter object properties
            whereClause += `a.address LIKE '%${filter.value ? filter.value : ''}%' OR `;
          }
        } else if (filter.field === 'numberofemployees' && filter.value) {
          whereClause = ' ';
          havingClause = `HAVING COUNT(WorkAt.UserID) = ${filter.value}`;
        }
      }
      whereClause = whereClause.slice(0, -4); // Remove trailing 'OR'
      havingClause = havingClause.slice(0, -4); // Remove trailing 'OR'
    }


    let orderByClause = '';
    if (sortModel && sortModel.length > 0) {
      orderByClause = ' ORDER BY ';
      for (const sort of sortModel) {
        if (sort.field !== 'numberofemployees' && sort.field !== 'address') {
          orderByClause += `w.${sort.field} ${sort.sort === 'asc' ? 'ASC' : 'DESC'}, `;
        } else if (sort.field == 'numberofemployees') {
          orderByClause += `NumberOfEmployees ${sort.sort === 'asc' ? 'ASC' : 'DESC'}, `;
        } else if (sort.field == 'address') {
          orderByClause += `a.${sort.field} ${sort.sort === 'asc' ? 'ASC' : 'DESC'}, `;
        }
      }
      orderByClause = orderByClause.slice(0, -2); // Remove trailing comma and space
    }

    if (orderByClause === '') {
      orderByClause = ' ORDER BY createdat DESC ';
    }
    // Call the static method getAllItems to fetch all items from the database
    const warehouses = await Admin.warehouseManager.getAllWarehouseAllInfo(page, pageSize, whereClause, orderByClause, havingClause);
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
    const warehouse = await Admin.warehouseManager.viewWarehouse(warehouseid);
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

export const getWarehouseByUserID = asyncHandle(async (req, res) => {
  try {
    const userid: number = parseInt(req.params.userid);

    // Call the static method getAllItems to fetch all items from the database
    const warehouse = await Admin.warehouseManager.getWarehouseByUserID(userid);
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
    const warehouseCreated = await Admin.warehouseManager.createWarehouse(phonenumber, warehouseName, warehouseLocation, avatar, isNewAddress);
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
    const warehouseUpdated = await Admin.warehouseManager.updateWarehouse(phonenumber, warehouseName, warehouseLocation, avatar, isNewAddress, warehouseid);
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
    const warehouseUpdated = await Admin.warehouseManager.updateWarehouseStatus(warehouseid, status);
    res.status(200).json({ message: 'Update warehouse status successfully', warehouseUpdated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi cập nhật trạng thái của kho:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});



export const getWarehouseNameList = asyncHandle(async (_req, res) => {
  try {
    const warehouseList = await Admin.warehouseManager.getWarehouseNameList();
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



