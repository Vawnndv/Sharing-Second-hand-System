/**
 * Your code here
 */

import express from 'express';
// import { mapOrder } from './utils/sorts.ts';
import routerItem from './routes/v1/itemRouter';
import  pool  from './config/DatabaseConfig'; // Import pool kết nối từ file dbConfig.ts
import authRouter from './routes/v1/authRouter';
import orderRouter from './routes/v1/orderRouter';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const hostname = 'localhost';
const port = 8017;

app.get('/', (req, res) => {
  // Test Absolute import mapOrder
  // console.log(mapOrder(
  //   [ { id: 'id-1', name: 'One' },
  //     { id: 'id-2', name: 'Two' },
  //     { id: 'id-3', name: 'Three' },
  //     { id: 'id-4', name: 'Four' },
  //     { id: 'id-5', name: 'Five' } ],
  //   ['id-5', 'id-4', 'id-2', 'id-3', 'id-1'],
  //   'id',
  // ));
  res.end('<h1>Hello World!</h1><hr>');
});

app.use(express.json());

app.use(routerItem);
app.use('/auth', authRouter);
app.use('/order', orderRouter);

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Listenning, I am running at ${ hostname }:${ port }/`);
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