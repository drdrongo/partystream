import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

interface s3Params {
  Bucket: string;
  Key: string;
  Expires: number;
  ContentType: string;
}

const getBucketParams = (fileExtension: string): [S3, s3Params] => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  const bucketName = process.env.BUCKET_NAME ?? '';

  // You need a unique key and the file extension
  const key = `${process.env.BUCKET_ENV ?? 'dev'}/${uuid()}.${fileExtension}`;
  const expirationTimeInSeconds =
    Number(process.env.URL_EXPIRATION_TIME) || 300; // The URL will be valid for 5 minutes

  // Create a pre-signed URL for uploading to S3
  const params: s3Params = {
    Bucket: bucketName,
    Key: key,
    Expires: expirationTimeInSeconds,
    ContentType: 'image/jpeg',
  };
  return [s3, params];
};

export const getUploadUrl = (fileExtension: string): string => {
  const [s3, params] = getBucketParams(fileExtension);
  const uploadUrl = s3.getSignedUrl('putObject', params);
  console.log('Secure upload URL:', uploadUrl);
  return uploadUrl;
};

const s3Utils = {
  getUploadUrl,
};

export default s3Utils;
