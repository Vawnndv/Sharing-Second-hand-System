import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import { Account } from '../classDiagramModel/Account';
import { CollaboratorManager } from '../classDiagramModel/Manager/CollaboratorManager';
import bcrypt from 'bcrypt';
import { handleSendMail } from './authController';

export const getAllCollaborator = asyncHandle(async (req: Request, res: Response) => {
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

  const response = await CollaboratorManager.getAllCollaborators(page, pageSize, whereClause, orderByClause);
  // res.json({ Collaborators: Collaborators.rows, total: totalCollaborators.rows[0].count });

  res.status(200).json({
    message: 'get Collaborator address successfully',
    data: {
      collaborators: response ?? [],
    },
  });

});

export const getCollaboratorByWarehouse = asyncHandle(async (req: Request, res: Response) => {
  const { warehouseID } = req.body;
  // Build WHERE clause based on filterModel (replace with your logic)
  

  const response = await CollaboratorManager.getCollaboratorsByWarehouse(warehouseID);
  // res.json({ Collaborators: Collaborators.rows, total: totalCollaborators.rows[0].count });

  res.status(200).json({
    message: 'get Collaborator address successfully',
    data: {
      collaborators: response ?? [],
    },
  });

});

export const adminCreateNewCollaborator = asyncHandle(async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, warehouseId, dob } = req.body;

  const existingUser = await Account.findUserByEmail(email);

  if (existingUser) {
    res.status(401);
    throw new Error('User has already exist!!!');
  }

  const password: number = Math.round(100000 + Math.random() * 9000);
  
  try {
    const data = {
      from: `"ReTreasure Application" <${process.env.USERNAME_EMAIL}>`, 
      to: email,
      subject: 'Verification email code', 
      text: 'Your code to verification email',
      html: `<h1>${password}</h1>`,
    };

    await handleSendMail(data);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    const newUser = await Account.createCollaborator(
      '',
      firstName, 
      lastName, 
      email, 
      hashedPassword,
      phoneNumber,
      dob,
      2,
    );
    if (newUser) {
      console.log(warehouseId, 'abcd');
      await CollaboratorManager.adminCreateWarehouseWorkCollaborator(newUser.userid, warehouseId);
      res.status(200).json({
        message: 'Register new collaborator successfully',
        data: {},
      });
    } else {
      res.send(400);
      throw new Error('Không thể tạo tài khoảng cộng tác viên');
    }
  } catch (error) {
    res.send(401);
    throw new Error('Can not send email');
  }
});


export const adminResetCollaboratorPassword = asyncHandle(async (req: Request, res: Response) => {
  const { email } = req.body;

  const randomPassword = Math.round(100000 + Math.random() * 99000);

  const data = {
    from: `"New Password" <${process.env.USERNAME_EMAIL}>`, 
    to: email,
    subject: 'Verification email code', 
    text: 'Your code to verification email',
    html: `<h1>${randomPassword}</h1>`,
  };

  const user = await Account.findUserByEmail(email);

  if (user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(`${randomPassword}`, salt);

    const updateUser = await Account.updateAccountPassword(user.userid, hashedPassword);

    if (updateUser) {
      await handleSendMail(data).then(() => {
        res.status(200).json({
          message: 'Send my new password successfully!!!',
          data: {},
        });
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

export const getTotalCollaborator = asyncHandle(async (req: Request, res: Response) => {
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

  const total = await CollaboratorManager.totalAllCollaborators(whereClause);
  // res.json({ users: users.rows, total: totalUsers.rows[0].count });
  res.status(200).json({
    message: 'get Collaborator address successfully',
    data: {
      total: total.total_users ?? 0,
    },
  });
});

export const adminBanCollaborator = asyncHandle(async (req: Request, res: Response) => {
  const { collaboratorId, isBanned } = req.body;
  // find Collaborator in DB
  const collaborator = await Account.findUserById(collaboratorId);

  if (collaborator) {
    await CollaboratorManager.adminBanCollaborator(collaboratorId, isBanned);
    res.json({ message: 'Collaborator was Banned successfully' });
  } else {
    res.status(400);
    throw Error('Collaborator not found');
  }
});

export const adminDeleteCollaborator = asyncHandle(async (req: Request, res: Response) => {
  const { id } = req.params;
  const ids = id.split(',');
  for (const collaboratorId of ids) {
    // find Collaborator in DB
    const collaborator = await Account.findUserById(collaboratorId);
    // if Collaborators exists update Collaborator data and save it in DB
    if (collaborator) {
      await CollaboratorManager.adminDeleteCollaborator(collaboratorId);
    } else {
      res.status(400);
      throw Error('Collaborator not found');
    }
  }

  res.json({ message: 'Collaborator was deleted successfully' });
});

export const adminEditCollaborator = asyncHandle(async (req: Request, res: Response) => {
  const { userId, firstName, lastName, email, phoneNumber, warehouseId, dob } = req.body;
  // find Collaborator in DB
  const collaborator = await Account.findUserById(userId);

  if (collaborator) {
    await CollaboratorManager.adminUpdateCollaborator(userId, firstName, lastName, email, phoneNumber, dob);
    await CollaboratorManager.adminUpdateWarehouseWorkCollaborator(userId, warehouseId);
    res.json({ message: 'Collaborator was Banned successfully' });
  } else {
    res.status(400);
    throw Error('Collaborator not found');
  }
});

export const getWarehouseInfoOfCollaborator = asyncHandle(async (req: Request, res: Response) => {

  const userid: number = parseInt(req.params.userid);
  const warehouseInfo = await CollaboratorManager.getWarehouseInfoOfCollaborator(userid);
  if (warehouseInfo) {
    res.status(200).json({ message: 'Get warehouse address of collaborator successfully', warehouseInfo: warehouseInfo });
  } else {
    res.status(400);
    throw Error('Cannot find warehouse info of this user');
  }

});



