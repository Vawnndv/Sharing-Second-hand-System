import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Account } from '../classDiagramModel/Account';
import { UserManager } from '../classDiagramModel/Manager/UserManager';

export const getProfile = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    const user = await Account.findUserById(userId);
    const countNumber = await UserManager.totalGiveAndReceiveOrder(userId);
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
    res.sendStatus(401);
    throw new Error('Missing uid');
  }
});

export const changeUserPassword = asyncHandle(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;
  const user = await Account.findUserByEmail(email);
  
  if (user) {
    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    
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
    const likePosts = await Account.findUserLikePostsById(userId);
    res.status(200).json({
      message: 'Get user like posts successfully !!!',
      data: likePosts,
    });
  } else {
    res.sendStatus(401);
    throw new Error('Missing uid');
  }
});

export const setUserLikePosts = asyncHandle(async (req: Request, res: Response) => {
  const { userId, postId } = req.body;
  if (postId && postId) {
    const likePosts = await Account.setUserLikePostsById(userId, postId);

    res.status(200).json({
      message: `Ins user id ${userId} like posts id ${postId} successfully !!!`,
      data: likePosts,
    });
  } else {
    res.sendStatus(401);
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
    res.sendStatus(401);
    throw new Error('Missing uid');
  }
});

export const getUserAddress = asyncHandle(async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId === 'string' && userId) {
    const response = await UserManager.getUserAddress(userId);

    res.status(200).json({
      message: 'get user address successfully',
      data: response,
    });
  } else {
    // If userId is missing or invalid, send a 401 status without throwing an error
    res.sendStatus(401);
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
//     const total = await UserManager.totalAllUser();

//     const response = await UserManager.getAllUser(page, pageSize);
//     res.status(200).json({
//       message: 'get user address successfully',
//       data: {
//         users: response ?? [],
//         total: total.total_users ?? 0,
//       },
//     });
//   } else {
//     res.sendStatus(404);
//     throw new Error('Missing page and pageSize');
//   }
// });

export const getAllUser = asyncHandle(async (req: Request, res: Response) => {
  const { filterModel = {}, sortModel = [], page = 0, pageSize = 5 } = req.body;
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

  const response = await UserManager.getAllUsers(page, pageSize, whereClause, orderByClause);
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

  const total = await UserManager.totalAllUser(whereClause);
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

  if (user) {
    await UserManager.adminBanUser(userId, isBanned);
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
      await UserManager.adminDeleteUser(userId);
    } else {
      res.status(400);
      throw Error('User not found' );
    }
  }

  res.json( { message: 'User was deleted successfully' });

});
