import { ItemManager } from '../classDiagramModel/Manager/ItemManager';
import asyncHandle from 'express-async-handler';

export const getItemDetails = asyncHandle(async (req, res) => {
  const itemID: number = parseInt(req.params.itemID);
  try {
    const itemDetails = await ItemManager.viewDetailsItem(itemID);
    console.log(itemDetails);
    if (itemDetails) {
      // Nếu chi tiết bài đăng được tìm thấy, trả về chúng dưới dạng phản hồi JSON
      res.status(200).json(itemDetails);
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