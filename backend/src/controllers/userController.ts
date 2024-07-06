import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Account } from '../classDiagramModel/Account';
import { User } from '../classDiagramModel/User';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USERNAME_EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const handleSendMail = async (val: {}) => {
  try {
    await transporter.sendMail(val);

    return 'Send banned or unbanned mail successfully!!!';
  } catch (error) {
    return error;
  }
};

export const getProfile = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    const user = await Account.findUserById(userId);
    const countNumber = await User.userManager.totalGiveAndReceiveOrder(userId);
    res.status(200).json({
      message: 'Get user profile successfully!!!',
      data: {
        email: user.email ?? '', 
        userId: user.userid,
        firstname: user.firstname ?? '',
        dob: user.dateofbirth ?? '',
        lastname: user.lastname ?? '',
        createAt: user.createat,
        phonenumber: user.phonenumber ?? '',
        username: user.username ?? '',
        avatar: user.avatar ?? '',
        address: user.address ?? '',
        giveCount: countNumber.givecount ?? 0,
        receiveCount: countNumber.receivecount ?? 0,
      },
    });
  } else {
    res.status(401);
    throw new Error('Missing uid');
  }
});

export const getUserOfTotalGiveAndReceiveOrder = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    const countNumber = await User.userManager.totalGiveAndReceiveOrder(userId);
    res.status(200).json({
      message: 'Get total Give And Receive Order of User successfully!!!',
      data: {
        giveCount: countNumber.givecount ?? 0,
        receiveCount: countNumber.receivecount ?? 0,
      },
    });
  } else {
    res.status(401);
    throw new Error('Missing uid');
  }
});

export const changeUserPassword = asyncHandle(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;
  const user = await Account.findUserByEmail(email);
  if (user) {
    const checkPassword = (oldPassword.trim().length === 0 && user.password.trim().length === 0) ? true :  await bcrypt.compare(oldPassword, user.password);

    
    if (checkPassword) {
      if (oldPassword === newPassword) {
        res.status(400);
        throw new Error('New password must different from old password!!!');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const updateUser = await Account.updateAccountPassword(user.userid, hashedPassword);

      if (updateUser) {
        res.status(200).json({
          message: 'Password changed successfully!!!',
          data: {},
        });
      } else {
        res.status(400);
        throw new Error('Update error!!!');
      }
    } else {
      res.status(400);
      throw new Error('Invalid old password!!!');
    } 
  } else {
    res.status(401);
    throw new Error('User not found!!!');
  }
});


export const changeUserProfile = asyncHandle(async (req: Request, res: Response) => {
  const { email, firstname, lastname, phonenumber, avatar, accessToken, dob } = req.body;

  const user = await Account.findUserByEmail(email);
  
  if (user) {      
    const updateUser = await Account.updateAccountProfile(user.userid, firstname, lastname, phonenumber, avatar, dob);

    if (updateUser) {
      res.status(200).json({
        message: 'Profile changed successfully!!!',
        data: {
          email,
          accessToken,
          id: updateUser.userid,
          firstName: updateUser.firstname ?? '',
          lastName: updateUser.lastname ?? '',
          phoneNumber: updateUser.phonenumber ?? '',
          dob: user.dateofbirth ?? '',
          roleID: updateUser.roleid, 
          avatar: updateUser.avatar ?? '',
        },
      });
    } else {
      res.status(400);
      throw new Error('Update error!!!');
    }
  } else {
    res.status(401);
    throw new Error('User not found!!!');
  } 
});


export const getUserLikePosts = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    const likePosts = await User.userManager.findUserLikePostsById(userId);
    res.status(200).json({
      message: 'Get user like posts successfully !!!',
      data: likePosts,
    });
  } else {
    res.status(401);
    throw new Error('Missing uid');
  }
});

export const getUserReceivePosts = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    const receivePosts = await User.userManager.findUserReceivePostsById(userId);
    res.status(200).json({
      message: 'Get user receive posts successfully !!!',
      data: receivePosts,
    });
  } else {
    res.status(401);
    throw new Error('Missing uid');
  }
});

export const setUserLikePosts = asyncHandle(async (req: Request, res: Response) => {
  const { userId, postId } = req.body;
  if (postId && postId) {
    const likePosts = await Account.setUserLikePostsById(userId, postId);
    
    res.status(200).json({
      message: `Insert user id ${userId} like posts id ${postId} successfully !!!`,
      data: likePosts,
    });
  } else {
    res.status(401);
    throw new Error('Missing uid');
  }
});

export const deleteUserLikePosts = asyncHandle(async (req: Request, res: Response) => {
  const { userId, postId } = req.query;
  if (typeof userId === 'string' && userId && typeof postId === 'string' && postId) {
    const likePosts = await Account.deleteUserLikePostsById(userId, postId);

    res.status(200).json({
      message: `Delete user id ${userId} like posts id ${postId} successfully !!!`,
      data: likePosts,
    });
  } else {
    res.status(401);
    throw new Error('Missing uid');
  }
});

export const getUserAddress = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    const response = await User.userManager.getUserAddress(userId);

    res.status(200).json({
      message: 'get user address successfully',
      data: response,
    });
  } else {
    // If userId is missing or invalid, send a 401 status without throwing an error
    res.status(401);
  }
});

export const updateFcmToken = asyncHandle(async (req: Request, res: Response) => {
  const { userid, fcmtoken } = req.body;

  await User.userManager.addFcmTokenToUser(userid, fcmtoken);

  res.status(200).json({
    message: 'Fcmtoken addded',
    data: [],
  });
});

export const getUserFcmTokens = asyncHandle(async (req: Request, res: Response) => {
  const { userid } = req.query;
  if (typeof userid === 'string' && userid) {
    const fcmTokens = await Account.getFcmTokenListOfUser(userid);  
    res.status(200).json({
      message: 'get user fcmtoken list successfully',
      data: {
        fcmTokens: fcmTokens ?? [],
      },
    });
  } else {
    // If userId is missing or invalid, send a 401 status without throwing an error
    res.status(401);
  }
});


//  ************** ADMIN CONTROLLERS **************
// @des Get all users
// @route GET /api/users
// export const getAllUser = asyncHandle(async (req: Request, res: Response) => {
//   console.log(req.query);
//   const { page, pageSize } = req.query;
//   if (typeof page === 'string' && page && typeof pageSize === 'string' && pageSize) {
//     console.log(req.query);
//     const total = await User.userManager.totalAllUser();

//     const response = await User.userManager.getAllUser(page, pageSize);
//     res.status(200).json({
//       message: 'get user address successfully',
//       data: {
//         users: response ?? [],
//         total: total.total_users ?? 0,
//       },
//     });
//   } else {
//     res.status(404);
//     throw new Error('Missing page and pageSize');
//   }
// });

export const getAllUser = asyncHandle(async (req: Request, res: Response) => {
  const { filterModel = {}, sortModel = [], page = 0, pageSize = 5 } = req.body;
  console.log(req.body);

  // Build WHERE clause based on filterModel (replace with your logic)
  let whereClause = '';
  if (filterModel.items && filterModel.items.length > 0) {
    whereClause = ' AND ';
    for (const filter of filterModel.items) {
      if (filter.operator === 'is' && filter.value) {
        whereClause += `u.${filter.field} is ${filter.value} OR `;
      } else if (filter.operator === 'contains') {
        // Add filtering conditions based on filter object properties
        whereClause += `u.${filter.field} LIKE '%${filter.value ? filter.value : ''}%' OR `;
      }

    }
    whereClause = whereClause.slice(0, -4); // Remove trailing 'OR'
  }

  // Build ORDER BY clause based on sortModel (replace with your logic)
  let orderByClause = '';
  if (sortModel && sortModel.length > 0) {
    orderByClause = ' ORDER BY ';
    for (const sort of sortModel) {
      orderByClause += `u.${sort.field} ${sort.sort === 'asc' ? 'ASC' : 'DESC'}, `;
    }
    orderByClause = orderByClause.slice(0, -2); // Remove trailing comma and space
  }

  
  if (orderByClause === '') {
    orderByClause = ' ORDER BY u.createdat DESC ';
  }

  const response = await User.userManager.getAllUsers(page, pageSize, whereClause, orderByClause);
  // res.json({ users: users.rows, total: totalUsers.rows[0].count });

  res.status(200).json({
    message: 'get user address successfully',
    data: {
      users: response ?? [],
    },
  });

});

export const getTotalUser = asyncHandle(async (req: Request, res: Response) => {
  const { filterModel = {} } = req.body;
  // console.log(filterModel)
  // Build WHERE clause based on filterModel (replace with your logic)
  let whereClause = '';
  if (filterModel.items && filterModel.items.length > 0) {
    whereClause = ' AND ';
    for (const filter of filterModel.items) {
      if (filter.operator === 'is' && filter.value) {
        whereClause += `u.${filter.field} is ${filter.value} OR `;
      } else if (filter.operator === 'contains') {
        // Add filtering conditions based on filter object properties
        whereClause += `u.${filter.field} LIKE '%${filter.value ? filter.value : ''}%' OR `;
      }
    }
    whereClause = whereClause.slice(0, -4); // Remove trailing 'OR'
  }

  const total = await User.userManager.totalAllUser(whereClause);
  // res.json({ users: users.rows, total: totalUsers.rows[0].count });

  res.status(200).json({
    message: 'get user address successfully',
    data: {
      total: total.total_users ?? 0,
    },
  });
});

export const adminBanUser =  asyncHandle(async (req: Request, res: Response) => {
  const { userId, isBanned } = req.body;

 
  // find user in DB
  const user = await Account.findUserById(userId);
  const currentTime = new Date().toLocaleString();

  if (user) {
    const data = {
      from: `"Ứng dụng ReTreasure" <${process.env.USERNAME_EMAIL}>`,
      to: user.email,
      subject: user.isbanned ? 'Thông báo về việc mở khóa tài khoản' : 'Thông báo về việc khóa tài khoản', // Chủ đề email được thay đổi thành "Ban tài khoản"
      text: user.isbanned ? `Tài khoản của bạn đã bị khóa vào lúc ${currentTime}` : `Tài khoản của bạn đã bị khóa vào lúc ${currentTime}`,
      html:  user.isbanned ? `<h3 style="font-weight: normal;">Tài khoản của bạn đã được mở khóa vào lúc ${currentTime}. Xin vui lòng liên hệ với admin qua email ${process.env.USERNAME_EMAIL} để biết thêm thông tin chi tiết.</h3>` : `<h3 style="font-weight: normal;">Tài khoản của bạn đã bị khóa vào lúc ${currentTime}. Xin vui lòng liên hệ với admin qua email ${process.env.USERNAME_EMAIL} để biết thêm thông tin chi tiết.</h3>`,
    };

    await User.userManager.adminBanUser(userId, isBanned);
    await handleSendMail(data);
    res.json( { message: 'User was Banned successfully' });
  } else {
    res.status(400);
    throw Error('User not found' );
  }
});

export const adminDeleteUser = asyncHandle(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ids = id.split(',');
  for (const userId of ids) {
    // find user in DB
    const user = await Account.findUserById(userId);
    // if users exists update user data and save it in DB
    if (user) {
      await User.userManager.adminDeleteUser(userId);
    } else {
      res.status(400);
      throw Error('User not found' );
    }
  }

  res.json( { message: 'User was deleted successfully' });

});
