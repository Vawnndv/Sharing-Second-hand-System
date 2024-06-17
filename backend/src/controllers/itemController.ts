import { ItemManager } from '../classDiagramModel/Manager/ItemManager';
import asyncHandle from 'express-async-handler';
import { Item } from '../classDiagramModel/Item';

export const getItemDetails = asyncHandle(async (req, res) => {
  const itemID: number = parseInt(req.params.itemID);
  try {
    const itemDetails = await ItemManager.viewDetailsItem(itemID);
   
    if (itemDetails) {
      // Nếu chi tiết bài đăng được tìm thấy, trả về chúng dưới dạng phản hồi JSON
      res.status(200).json({ message: 'Item founded', item: itemDetails });
    } else {
      // Nếu không tìm thấy chi tiết bài đăng, trả về một thông báo lỗi
      res.status(404).json({ message: 'Không tìm thấy món đồ.' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi lấy món đồ:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});


export const getItemImages = asyncHandle(async (req, res) => {
  const itemID: number = parseInt(req.params.itemID);
 
  try {
    const itemImages = await ItemManager.viewItemImages(itemID);

    if (itemImages) {
      // Nếu chi tiết bài đăng được tìm thấy, trả về chúng dưới dạng phản hồi JSON
      res.status(200).json({ message: 'Item images founded', itemImages: itemImages });
    } else {
      // Nếu không tìm thấy chi tiết bài đăng, trả về một thông báo lỗi
      res.status(404).json({ message: 'Không tìm thấy món đồ.' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi lấy món đồ:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const getAllItems = asyncHandle(async (req, res) => {
  try {
    // Call the static method getAllItems to fetch all items from the database
    const items = await Item.getAllItems();
    // If items are found, return them as a response
    if (items) {
      res.status(200).json(items);
    } else {
      // If no items are found, return an empty array
      res.status(200).json([]);
    }
  } catch (error) {
    // If there's an error, return a 500 error
    console.error('Error retrieving items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export const getAllItemTypes = asyncHandle(async (req, res) => {
  try {
    // Call the static method getAllItems to fetch all items from the database
    const itemTypes = await ItemManager.viewAllItemTypes();
    // If items are found, return them as a response
    if (itemTypes) {
      res.status(200).json({ message: 'Item types founded', itemTypes: itemTypes });
    } else {
      // If no items are found, return an empty array
      res.status(200).json([]);
    }
  } catch (error) {
    // If there's an error, return a 500 error
    console.error('Error retrieving item types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const postNewItem = asyncHandle(async (req, res) => {
  const { name, quantity, itemtypeID } = req.body;
  console.log(req.body, 'âfaf');
  try {
    const newItem = await ItemManager.createItem(name, quantity, itemtypeID);
    console.log(newItem, '....................');
    res.status(200).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const postImageItem = asyncHandle(async (req, res) => {
  const { path, itemID } = req.body;
  
  try {
    const response = await ItemManager.uploadImageItem(path, itemID);
    res.status(201).json({ message: 'Item created successfully', status:  response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

