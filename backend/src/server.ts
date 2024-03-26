/**
 * Your code here
 */

import express from 'express';
// import { mapOrder } from './utils/sorts.ts';
import routerItem from './routes/v1/itemRouter';
import orderRoute from './routes/orderRoutes/orderRoute';
import  pool  from './config/DatabaseConfig'; // Import pool kết nối từ file dbConfig.ts
import authRouter from './routes/v1/authRouter';
import orderRouter from './routes/v1/orderRouter';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const port = 8017;

app.use(express.json());

app.use(routerItem);
app.use('/auth', authRouter);
app.use('/order', orderRouter);

app.use(orderRoute);

app.listen(port, (err?: Error) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server starting at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('Closing pool connections...');
  pool.end()
    .then(() => {
      console.log('Pool connections closed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error closing pool connections', err);
      process.exit(1);
    });
});