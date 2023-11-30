import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const AWS_REGION = process.env.AWS_REGION || '';
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

const AWSConnectionParams = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
}

export const AWSPresignedUrlParams = {
    Bucket: AWS_S3_BUCKET_NAME,
    Expires: 300,
}

export const s3 = new AWS.S3(AWSConnectionParams);

