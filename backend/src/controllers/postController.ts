import { AddressManager } from '../classDiagramModel/Manager/AddressManager';
import { ItemManager } from '../classDiagramModel/Manager/ItemManager';
import { PostManager } from '../classDiagramModel/Manager/PostManager';
import asyncHandle from 'express-async-handler';

export const getAllPostFromUserPost = asyncHandle(async (req, res) => {
  const { limit, page, distance, time, category, sort, latitude, longitude, warehouses } = req.body;


  const allPosts = await PostManager.getAllPostsFromUserPost(limit, page, distance, time, category, sort, latitude, longitude, warehouses);
  
  if (allPosts) {
    res.status(200).json({ message: 'Get all posts successfully', allPosts });
  } else {
    res.status(200).json({ message: 'Không có bài đăng nào', allPosts: null });
  }
});

export const getAllPostFromWarehouse  = asyncHandle(async (req, res) => {
  const { limit, page, distance, time, category, sort, latitude, longitude, warehouses } = req.body;

  
  const allPosts = await PostManager.getAllPostFromWarehouse(limit, page, distance, time, category, sort, latitude, longitude, warehouses);

  // const postReceivers = await PostManager.viewPostReceivers(postID);

  if (allPosts) {
    res.status(200).json({ message: 'Get all posts successfully', allPosts });
  } else {
    res.status(200).json({ message: 'Không có bài đăng nào', allPosts: null });
  }
});

export const getTotalPost = asyncHandle(async (req, res) => {
  const { status, userID } = req.body;

  
  const totalPosts = await PostManager.getTotalPost(status, userID);

  // const postReceivers = await PostManager.viewPostReceivers(postID);

  if (totalPosts) {
    res.status(200).json({ message: 'Get all posts successfully', totalPosts });
  } else {
    res.status(200).json({ message: 'Không có bài đăng nào', totalPosts: 0 });
  }
});

export const getAllPostByStatus  = asyncHandle(async (req, res) => {
  const { status, limit, page, distance, time, category, sort, latitude, longitude, warehouses, userID } = req.body;


  const allPosts = await PostManager.getAllPostByStatus(status, limit, page, distance, time, category, sort, latitude, longitude, warehouses, userID);

  // const postReceivers = await PostManager.viewPostReceivers(postID);

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

export const getPostOwnerInfo = asyncHandle(async (req, res) => {
  const postID: number = parseInt(req.params.postID);
  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postOwnerInfos = await PostManager.viewPostOwnerInfo(postID);

    if (postOwnerInfos) {
      // Nếu chi tiết bài đăng được tìm thấy, trả về chúng dưới dạng phản hồi JSON
      res.status(200).json({ message: 'Get post owner successfully', postOwnerInfos: postOwnerInfos });
    } else {
      // Nếu không tìm thấy chi tiết bài đăng, trả về một thông báo lỗi
      res.status(404).json({ message: 'Không tìm thấy người đăng bài.' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi lấy người đăng bài:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const getPostReceivers = asyncHandle(async (req, res) => {
  const postID: number = parseInt(req.params.postID);

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postReceivers = await PostManager.viewPostReceivers(postID);

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
  const isNewAddress = req.body.isNewAddress;
  const postLocation = req.body.postLocation;
  const isWarehousePost = req.body.isWarehousePost;
  const statusid = req.body.statusid;
  const givetypeid = req.body.givetypeid;
  const warehouseid = req.body.warehouseid;
  const phonenumber = req.body.phonenumber;

  console.log(req.body);

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postCreated = await PostManager.createPost(title, location, description, owner, time, itemid, timestart, timeend, isNewAddress, postLocation, isWarehousePost, statusid, givetypeid, warehouseid, phonenumber);
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
  const warehouseid = req.body.warehouseid;


  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postReceiverCreated = await PostManager.createPostReceiver(postid, receiverid, comment, time, receivertypeid, warehouseid);
    res.status(200).json({ message: 'Create post receiver successfully', postReceiverCreated: postReceiverCreated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi thêm người nhận:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const searchPost = asyncHandle(async (req, res) => {
  const { keyword, limit, iswarehousepost, page, distance, time, category, sort, latitude, longitude, warehouses } = req.body;
  
  try {
    const postList = await PostManager.searchPost(keyword, limit, iswarehousepost, page, distance, time, category, sort, latitude, longitude, warehouses);
    res.status(200).json({ message: 'Get post list success', data: postList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const getUserLikePosts = asyncHandle(async (req, res) => {
  const userId: any = req.query.userId;
  const limit : any = req.query.limit;
  const page : any = req.query.page;

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const allPosts = await PostManager.getUserLikePosts(limit, page, userId);
  
    res.status(200).json({ message: 'Lấy danh sách bài đăng yêu thích thành công', allPosts });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi lấy chi tiết bài đăng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const getAmountUserLikePost = asyncHandle(async (req, res) => {
  const postID: any = req.query.postID;

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const amount = await PostManager.getAmountUserLikePost(postID);
  
    res.status(200).json({ message: 'Lấy số lượng yêu thích của bài đăng thành công', amount });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi lấy chi tiết bài đăng:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});


export const deletePostReceivers = asyncHandle(async (req, res) => {
  const postID: any = req.query.postID;
  const receiverID: any = req.query.receiverID;
 
  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postReceivers = await PostManager.deletePostReceivers(postID, receiverID);
    if (postReceivers)
      res.status(200).json({ message: 'Delete receiver successfully' });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Error when delete postreceivers:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const  updatePostStatus = asyncHandle(async (req, res) => {
  const postid: any = req.body.postid;
  const statusid: any = req.body.statusid;
  const isApproveAction: any = req.body.isApproveAction;
  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postUpdated = await PostManager.updatePostStatus(postid, statusid, isApproveAction);
    if (postUpdated)
      res.status(200).json({ message: 'Post Updated Sucessfully', postUpdated });
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Error when update post:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});

export const getAllPostByUserId = asyncHandle(async (req, res) => {
  const { userID } = req.body;


  const data = await PostManager.getAllPostByUserId(userID);
  
  if (data) {
    res.status(200).json({ message: 'Get all posts successfully', data });
  } else {
    res.status(200).json({ message: 'Không có bài đăng nào', allPosts: null });
  }
});


export const  EditPost = asyncHandle(async (req, res) => {
  const postid: any = req.body.postid;
  // const isAddImage: any = req.body.isAddImage;
  const isDeleteImage: any = req.body.isDeleteImage;
  const newTitle: any = req.body.newTitle;
  const newDescription: any = req.body.newDescription;
  const newLocation: any = req.body.newLocation;
  const newStartDate: any = req.body.newStartDate;
  const newEndDate: any = req.body.newEndDate;
  // const imageAddArray: any = req.body.imageAddArray;
  const imageDeleteArray: any = req.body.imageDeleteArray;
  // const itemid: any = req.body.itemid;
  const addressid: any = req.body.addressid;

  // let addImage = false;
  let deleteImage = false;


  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    // if (isAddImage) {
    //   for (let i = 0; i < imageAddArray.length; i++) {
    //     await ItemManager.uploadImageItem(imageAddArray[i].path, itemid);
    //   }
    //   addImage = true;
    // }
    // if (!isAddImage) {
    //   addImage = true;
    // }

    if (!isDeleteImage) {
      deleteImage = true;
    }
    if (isDeleteImage) {
      for (let i = 0; i < imageDeleteArray.length; i++) {
        await ItemManager.deleteImageItem(imageDeleteArray[i].imgid);
      }
      deleteImage = true;
    }

    const postUpdated: any = await PostManager.updatePostDetail(postid, newTitle, newDescription, newStartDate, newEndDate);
    const addressUpdated: any = await AddressManager.updateAddress(addressid, newLocation.address, newLocation.longitude, newLocation.latitude);
    if (postUpdated && deleteImage && addressUpdated) {
      res.status(200).json({ message: 'Post Updated Sucessfully', postUpdated });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Error when update post:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});