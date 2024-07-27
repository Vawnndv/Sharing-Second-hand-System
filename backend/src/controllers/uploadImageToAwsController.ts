// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';
import { Request, Response } from 'express';


const region = 'ap-southeast-2';
const accessKeyId = 'AKIA2UC3DMHZX2UTZ47T';
const secretAccessKey = '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';

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region, // Ví dụ: 'us-east-1'
});


export const uploadImage = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).send('Error processing upload');
  }
};