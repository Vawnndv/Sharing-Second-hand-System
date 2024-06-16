// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Bạn có thể thay đổi 'any' thành kiểu cụ thể của người dùng
  }
}