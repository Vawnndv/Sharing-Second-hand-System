import { PostManager } from '../classDiagramModel/Manager/PostManager';
import asyncHandle from 'express-async-handler';


export const getPostDetails = asyncHandle(async (req, res) => {
  const postID: number = parseInt(req.params.postID);
  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postDetails = await PostManager.viewDetailsPost(postID);
    console.log(postDetails);
    if (postDetails) {
      // Nếu chi tiết bài đăng được tìm thấy, trả về chúng dưới dạng phản hồi JSON
      res.status(200).json(postDetails);
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
    if (postReceivers) {
      // Nếu chi tiết bài đăng được tìm thấy, trả về chúng dưới dạng phản hồi JSON
      res.status(200).json(postReceivers);
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

export const createPost = asyncHandle(async (req, res) => {
  const title = req.body.title;
  const location = req.body.location;
  const description = req.body.description;
  const owner = req.body.owner;
  const time = req.body.time;
  const itemid = req.body.owner;
  const timestart = req.body.timestart;
  const timeend = req.body.timeend;

 

  try {
    // Gọi phương thức viewDetailsPost từ lớp Post để lấy chi tiết bài đăng từ cơ sở dữ liệu
    const postCreated = await PostManager.createPost(title, location, description, owner, time, itemid, timestart, timeend);
    console.log(postCreated);
    if (postCreated != null) {
      // Nếu chi tiết bài đăng được tìm thấy, trả về chúng dưới dạng phản hồi JSON
      res.status(200).json(postCreated);
    } else {
      // Nếu không tìm thấy chi tiết bài đăng, trả về một thông báo lỗi
      res.status(404).json({ message: 'Bài viết up không thành công vui lòng thử lại.' });
    }
  } catch (error) {
    // Nếu có lỗi xảy ra, trả về một phản hồi lỗi và ghi log lỗi
    console.error('Lỗi khi gửi bài viết:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
  }
});
