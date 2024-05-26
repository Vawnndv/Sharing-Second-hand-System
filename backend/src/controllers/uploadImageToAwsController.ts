// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import { Request, Response } from 'express';


const region = 'ap-southeast-2';
const accessKeyId = 'AKIA2UC3DMHZX2UTZ47T';
const secretAccessKey = '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';
// const bucket = 'retreasure';
// const URL = 'https://retreasure.s3.ap-southeast-2.amazonaws.com/';

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region, // Ví dụ: 'us-east-1'
});

// const s3 = new AWS.S3();

export const uploadImage = async (req: Request, res: Response) => {
  try {

    // const params = {
    //   Bucket: bucket,
    //   Key: `${file.originalname}`,
    //   Body: file.buffer, // Sử dụng file.buffer thay vì file.data
    //   ContentType: file.mimetype, // Loại tệp tin của tệp tin đã đọc
    // };

    // Gửi yêu cầu PUT đến AWS S3
    // s3.putObject(params, (err, data) => {
    //   if (err) {
    //     console.error('Error uploading file to AWS S3:', err);
    //     res.status(500).send('Error uploading file to AWS S3');
    //   } else {
    //     console.log('File uploaded successfully:', data);
    //     res.status(201).json({
    //       url: `${URL}${file.originalname}`,
    //     });
    //   }
    // });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).send('Error processing upload');
  }
};