import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

interface s3Params {
  Bucket: string;
  Key: string;
  Expires: number;
  ContentType: string;
}

const getBucketName = (): string => process.env.BUCKET_NAME ?? '';
const getBucketPrefix = (): string => process.env.BUCKET_PREFIX ?? 'dev';

const getS3Instance = (): S3 => {
  return new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
};

export const getUploadUrl = (fileExtension: string): string => {
  const bucketName = getBucketName();
  const bucketPrefix = getBucketPrefix();

  // You need a unique key and the file extension
  const key = `${bucketPrefix}/${uuid()}.${fileExtension}`;
  const expirationTimeInSeconds =
    Number(process.env.URL_EXPIRATION_TIME) || 300; // The URL will be valid for 5 minutes

  // Create a pre-signed URL for uploading to S3
  const params: s3Params = {
    Bucket: bucketName,
    Key: key,
    Expires: expirationTimeInSeconds,
    ContentType: 'image/jpeg',
  };

  const s3 = getS3Instance();
  const uploadUrl = s3.getSignedUrl('putObject', params);
  return uploadUrl;
};

export const getObjectList = async (): Promise<string[]> => {
  try {
    const bucketName = getBucketName();

    const prefix = getBucketPrefix();

    const s3 = getS3Instance();
    // List objects in the bucket
    const data = await s3
      .listObjectsV2({ Bucket: bucketName, Prefix: prefix })
      .promise();

    if (!data.Contents) {
      throw new Error('no s3 objects');
    }

    data.Contents.shift();

    return data.Contents.reduce<string[]>(
      (acc, { Key }) => (Key ? [...acc, Key] : acc),
      [],
    );
  } catch (error) {
    console.error("Error in 'getObjectList'");
    return [];
  }
};

const s3Utils = {
  getUploadUrl,
  getObjectList,
};

export default s3Utils;
