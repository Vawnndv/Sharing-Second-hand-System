import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleHandle = (err: Error, _req: Request, res: Response, _next: NextFunction) =>{
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.log({
    message: err.message,
    statusCode,
    stack: err.stack,
  });
  
  res.status(statusCode).json({
    message: err.message,
    statusCode,
    stack: err.stack,
  });
};

export default errorMiddleHandle;
