import dotenv from 'dotenv';
dotenv.config();
import asyncHandle from 'express-async-handler';
import { Request, Response } from 'express';
import { Account } from '../classDiagramModel/Account';
import { CollaboratorManager } from '../classDiagramModel/Manager/CollaboratorManager';

export const getAllCollaborator = asyncHandle(async (req: Request, res: Response) => {
  const { filterModel = {}, sortModel = [], page = 0, pageSize = 5 } = req.body;
  console.log(filterModel);
  // Build WHERE clause based on filterModel (replace with your logic)
  let whereClause = '';
  if (filterModel.items && filterModel.items.length > 0) {
    whereClause = ' AND ';
    for (const filter of filterModel.items) {
      if (filter.operator === 'is' && filter.value) {
        console.log(filter.value, 'filter');
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

export const getTotalCollaborator = asyncHandle(async (req: Request, res: Response) => {
  console.log('13123hello');
  const { filterModel = {} } = req.body;
  // console.log(filterModel)
  // Build WHERE clause based on filterModel (replace with your logic)
  let whereClause = '';
  if (filterModel.items && filterModel.items.length > 0) {
    whereClause = ' AND ';
    for (const filter of filterModel.items) {
      if (filter.operator === 'is' && filter.value) {
        console.log(filter.value, 'filter');
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
  console.log(total, '13123');
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
  console.log(ids);
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
