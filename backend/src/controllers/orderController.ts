import { Request, Response } from 'express';
import dotenv from 'dotenv';
import asyncHandle from 'express-async-handler';
import { User } from '../classDiagramModel/User';
dotenv.config();

export const getOrderList = async (req: Request, res: Response) => {
  const { userID, distance, time, category, sort, latitude, longitude } = req.body;
  
  try {
    const orderList = await User.orderManager.getOrderList(userID, distance, time, category, sort, latitude, longitude);
    res.status(200).json({ message: 'Get orders list success:', data: orderList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderFinishList = async (req: Request, res: Response) => {
  const { userID, distance, time, category, sort, latitude, longitude } = req.body;
  
  try {
    const orderListFinish = await  User.orderManager.getOrderFinishList(userID, distance, time, category, sort, latitude, longitude);
    res.status(200).json({ message: 'Get orders finish list success:', data: orderListFinish });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTrackingStatus = async (req: Request, res: Response) => {
  const orderID : any = req.query.orderID;
  
  try {
    const trackingList = await  User.orderManager.getTrackingOrderByID(orderID);
    res.status(200).json({ message: 'Get tracking list success:', data: trackingList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const uploadImageConfirmOrder = async (req: Request, res: Response) => {
  const { orderid, imgconfirmreceive } = req.body;
  
  try {
    await User.orderManager.uploadImageConfirmOrder(orderid, imgconfirmreceive);
    res.status(200).json({ message: 'Update image success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderDetails = asyncHandle(async (req, res) => {
  const orderID: number = parseInt(req.params.orderID);
  try {
    const orderDetails = await User.orderManager.getOrderDetails(orderID);
    if (orderDetails) {
      res.status(200).json({ message: 'Get order details success', data: orderDetails });
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Error:', error);
    res.status(500).json({ message: 'Error network' });
  }
});

export const VerifyOrderQR = asyncHandle(async (req, res) => {
  const orderID : any = req.query.orderID;
  try {
    const result = await  User.orderManager.VerifyOrderQR(orderID);
    if (result == null)
      res.status(400).json({ message: 'Not found post or order', data: result });
    res.status(200).json({ message: 'Verify success', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const updateStatusOfOrder = asyncHandle(async (req, res) => {
  const { orderID, statusID } = req.body;
  
  try {
    const result = await User.orderManager.updateStatusOfOrder(orderID, statusID);
    if (result)
      res.status(200).json({ message: 'Update success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

export const createOrder = asyncHandle(async (req, res) => {
  const title = req.body.title;
  const location = req.body.location;
  const description = req.body.description;
  const departure = req.body.departure;
  const time = req.body.time;
  const itemid = req.body.itemid;
  const status = req.body.status;
  const qrcode = req.body.qrcode;
  const ordercode = req.body.ordercode;
  const usergiveid = req.body.usergiveid;
  const postid = req.body.postid;
  const imgconfirm = req.body.imgconfirm;
  const locationgive = req.body.locationgive;
  const locationreceive = req.body.locationreceive;
  const givetypeid = req.body.givetypeid;
  const imgconfirmreceive = req.body.imgconfirmreceive;
  const givetype = req.body.givetype;
  const warehouseid = req.body.warehouseid;
  const userreceiveid = req.body.userreceiveid;


  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const orderCreated = await User.orderManager.createOrder(title, departure, time, description, location, status, qrcode, ordercode, usergiveid, itemid, postid, givetype, imgconfirm, locationgive, locationreceive, givetypeid, imgconfirmreceive, warehouseid, userreceiveid);
    res.status(200).json({ message: 'Create order successfully', orderCreated: orderCreated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi tạo đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }

});


export const createTrace = asyncHandle(async (req, res) => {
  const currentstatus = req.body.currentstatus;
  const orderid = req.body.orderid;

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const traceCreated = await User.orderManager.createTrace(currentstatus, orderid);
    // const orderid: string = String(traceCreated.traceid);
    res.status(200).json({ message: 'Create trace successfully', traceCreated: traceCreated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Fail while inserting trace:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});


export const updateOrderReceiver = asyncHandle(async (req, res) => {
  const orderid = req.body.orderid;
  const userreceiveid = req.body.userreceiveid;
  const givetypeid = req.body.givetypeid;
  const givetype = req.body.givetype;
  const warehouseid = req.body.warehouseid;

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const updatedOrder = await User.orderManager.updateOrderReceiver(orderid, userreceiveid, givetypeid, givetype, warehouseid);
    // const orderid: string = String(traceCreated.traceid);
    res.status(200).json({ message: 'Update order successfully', updatedOrder: updatedOrder });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Fail while updatting order:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const updateTraceStatus = asyncHandle(async (req, res) => {
  const orderid = req.body.orderid;
  const newstatus = req.body.newstatus;
  const statusid = req.body.statusid;

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const updatedOrder = await User.orderManager.updateTraceStatus(orderid, newstatus, statusid);
    // const orderid: string = String(traceCreated.traceid);
    res.status(200).json({ message: 'Update trace successfully', updatedOrder: updatedOrder });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Fail while updating trace:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});



export const getOrderByPostID = asyncHandle(async (req, res) => {
  const postID: number = parseInt(req.params.postID);
 
  try {
    const order = await User.orderManager.getOrderByPostID(postID);
    if (order) {
      res.status(200).json({ message: 'Get order successfully', order: order });
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const getOrderListReceive = async (req: Request, res: Response) => {
  const { userID } = req.body;
  
  try {
    const orderList = await  User.orderManager.getOrderListReceive(userID);
    res.status(200).json({ message: 'Get orders list success:', data: orderList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderListByStatus = async (req: Request, res: Response) => {
  const { userid, status, method, limit, page, isOverdue, filterValue } = req.body;
  try {
    const orderList = await  User.orderManager.getOrderListByStatus(userid, status, method, limit, page, isOverdue, filterValue);
    res.status(200).json({ message: 'Get orders list success:', data: orderList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};