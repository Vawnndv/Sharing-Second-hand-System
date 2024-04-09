import { PostManager } from '../classDiagramModel/Manager/PostManager';
import asyncHandle from 'express-async-handler';

export const getAllPostFromUserPost = asyncHandle(async (req, res) => {
  const allPosts = await PostManager.getAllPostsFromUserPost();

  if (allPosts) {
    res.status(200).json({ message: 'Get all posts successfully', allPosts });
  } else {
    res.status(200).json({ message: 'Không có bài đăng nào', allPosts: null });
  }
});

export const getAllPostFromWarehouse  = asyncHandle(async (req, res) => {
  const allPosts = await PostManager.getAllPostFromWarehouse();

  if (allPosts) {
    res.status(200).json({ message: 'Get all posts successfully', allPosts });
  } else {
    res.status(200).json({ message: 'Không có bài đăng nào', allPosts: null });
  }
});

// export const getFilterPostList = asyncHandle(async (req, res) => {
//   const userID : any = req.query.userID;
//   const distance : any = req.query.distance;
//   const time : any = req.query.time;
//   const category : any = req.query.category;
//   const sort : any = req.query.sort;
//   const latitude : any = req.query.latitude;
//   const longitude : any = req.query.longitude;
  
//   try {
//     const orderList = await  PostManager.getOrderList(userID, distance, time, category, sort, latitude, longitude);
//     res.status(200).json({ message: 'Get orders list success:', data: orderList });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


export const getPostDetails = asyncHandle(async (req, res) => {
  const postID: number = parseInt(req.params.postID);
  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postDetails = await PostManager.viewDetailsPost(postID);
    console.log(postDetails);
    if (postDetails) {
      // Nếu chi tiết bài đăng được tìm thấy, trả về chúng dưới dạng phản hồi JSON
      res.status(200).json({ message: 'Get post successfully', postDetail: postDetails });
    } else {
      // Nếu không tìm thấy chi tiết bài đăng, trả về một thông báo lỗi
      res.status(404).json({ message: 'Không tìm thấy chi tiết bài đăng.' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi lấy chi tiết bài đăng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const getPostReceivers = asyncHandle(async (req, res) => {
  const postID: number = parseInt(req.params.postID);
  console.log(postID);
  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postReceivers = await PostManager.viewPostReceivers(postID);
    console.log(postReceivers);
    res.status(200).json({ message: 'Get post receiver successfully', postReceivers: postReceivers });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi lấy chi tiết bài đăng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const createPost = asyncHandle(async (req, res) => {
  const title = req.body.title;
  const location = req.body.location;
  const description = req.body.description;
  const owner = req.body.owner;
  const time = req.body.time;
  const itemid = req.body.itemid;
  const timestart = req.body.timestart;
  const timeend = req.body.timeend;

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postCreated = await PostManager.createPost(title, location, description, owner, time, itemid, timestart, timeend);
    res.status(200).json({ message: 'Create post successfully', postCreated: postCreated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi gửi bài viết:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const createPostReceiver = asyncHandle(async (req, res) => {
  const postid = req.body.postid;
  const receiverid = req.body.receiverid;
  const comment = req.body.comment;
  const time = req.body.time;
  const receivertypeid = req.body.receivertypeid;

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postReceiverCreated = await PostManager.createPostReceiver(postid, receiverid, comment, time, receivertypeid);
    res.status(200).json({ message: 'Create post receiver successfully', postReceiverCreated: postReceiverCreated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi thêm người nhận:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const searchPost = asyncHandle(async (req, res) => {
  const keyword : any = req.query.keyword;
  const limit : any = req.query.limit;
  const iswarehousepost : any = req.query.iswarehousepost;
  const page : any = req.query.page;
  const distance : any = req.query.distance;
  const time : any = req.query.time;
  const category : any = req.query.category;
  const sort : any = req.query.sort;
  const latitude : any = req.query.latitude;
  const longitude : any = req.query.longitude;
  
  try {
    const postList = await PostManager.searchPost(keyword, limit, iswarehousepost, page, distance, time, category, sort, latitude, longitude);
    res.status(200).json({ message: 'Get post list success', data: postList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
