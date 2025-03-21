import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routerItem from './routes/itemRouter';
import orderCollaboratorRoute from './routes/orderCollaboratorRoute';
import  pool  from './config/DatabaseConfig'; 
import routerPost from './routes/postRouter';
import authRouter from './routes/authRouter';
import orderRouter from './routes/orderRouter';
import uploadImageToAwsRoute from './routes/uploadImageToAwsRoute';
import warehouseRouter from '././routes/warehouseRouter';
import cors from 'cors';
import errorMiddleHandle from './middlewares/errorMiddleware';
import userRouter from './routes/userRouter';
import cardRouter from './routes/cardRouter';
import chatRouter from './routes/chatRouter';
import mapRouter from './routes/mapRouter';
import statisticRouter from './routes/statisticRouter';
import collaboratorRouter from './routes/collaboratorRouter';
import reportRouter from './routes/reportRouter';
import ratingRouter from './routes/ratingRouter';

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Wellcome to ReTreasure - Sharing Second-hand System');
});

app.use(express.json());

app.use('/posts', routerPost);
app.use('/items', routerItem);
app.use(orderCollaboratorRoute);
app.use('/warehouse', warehouseRouter);

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/collaborator', collaboratorRouter);
app.use('/order', orderRouter);
app.use('/aws3', uploadImageToAwsRoute);
app.use('/card', cardRouter);
app.use('/chat', chatRouter);
app.use('/map', mapRouter);

app.use('/report', reportRouter);
app.use('/rating', ratingRouter);

app.use('/statistic', statisticRouter);

app.use(errorMiddleHandle);

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