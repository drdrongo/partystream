import { S3 } from 'aws-sdk';

interface s3Params {
  Bucket: string;
  Key: string;
  Expires: number;
  ContentType: string;
}

const getBucketParams = (): [S3, s3Params] => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-northeast-1',
  });
  const bucketName = 'partystream-1';
  const key = 'dev/plant-1.jpeg'; // S3 key
  const expirationTimeInSeconds = 300; // The URL will be valid for 5 minutes

  // Create a pre-signed URL for uploading to S3
  const params: s3Params = {
    Bucket: bucketName,
    Key: key,
    Expires: expirationTimeInSeconds,
    ContentType: 'image/jpeg',
  };
  return [s3, params];
};

export const getUploadUrl = (): string => {
  const [s3, params] = getBucketParams();
  const uploadUrl = s3.getSignedUrl('putObject', params);
  console.log('Secure upload URL:', uploadUrl);
  return uploadUrl;
};

const s3Utils = {
  getUploadUrl,
};

export default s3Utils;
