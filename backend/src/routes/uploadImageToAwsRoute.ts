import express from 'express';
// import { uploadImage } from '../../controllers/uploadImageToAwsController';
// eslint-disable-next-line import/no-extraneous-dependencies
import multer from 'multer';
// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
// import fs from 'fs';
import { Request, Response } from 'express';


const region = 'ap-southeast-2';
const accessKeyId = 'AKIA2UC3DMHZX2UTZ47T';
const secretAccessKey = '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';
const bucket = 'retreasure';
const URL = 'https://retreasure.s3.ap-southeast-2.amazonaws.com/';

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region, // Ví dụ: 'us-east-1'
});

const s3 = new AWS.S3();

// Địa nghĩa nơi lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, callback) =>{
    callback(null, './public/uploads/');
  },
  filename: (req, file, callback) => {
    // Tạo tên tệp mới bằng thời gian hiện tại và phần mở rộng của tệp gốc
    const extension = file.originalname;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}${extension}`;
    callback(null, filename);
  },
});




const upload = multer({ 
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 50,
  },
});  

const router = express.Router();
router.post('/uploadImage', upload.single('file'), async (req: Request, res: Response) => {


  if (req.body.file) {
    

    // const dataImage = fs.readFileSync(file.path);
    const params = {
      Bucket: bucket,
      Key: `${req.body.name}`,
      Body: Buffer.from(req.body.file, 'base64'), // Sử dụng file.buffer thay vì file.data
      ContentType: `${req.body.type}`, // Loại tệp tin của tệp tin đã đọc
    };
      
    //   Gửi yêu cầu PUT đến AWS S3
    s3.putObject(params, (err, data) => {
      if (err) {
        console.error('Error uploading file to AWS S3:', err);
        res.status(500).send('Error uploading file to AWS S3');
      } else {
        console.log('File uploaded successfully:', data);
        res.status(200).json({
          
          url: `${URL}${req.body.name}`,
          
        });
      }
    });
  } else {
    console.log('error');
    res.json('error upload image');
  }
  
});
export default router;