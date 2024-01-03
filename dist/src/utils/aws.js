"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectList = exports.getUploadUrl = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const getBucketName = () => process.env.BUCKET_NAME ?? '';
const getBucketPrefix = () => process.env.BUCKET_PREFIX ?? 'dev';
const getS3Instance = () => {
    return new aws_sdk_1.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
};
const getUploadUrl = (fileExtension) => {
    const bucketName = getBucketName();
    const bucketPrefix = getBucketPrefix();
    const key = `${bucketPrefix}/${(0, uuid_1.v4)()}.${fileExtension}`;
    const expirationTimeInSeconds = Number(process.env.URL_EXPIRATION_TIME) || 300;
    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: expirationTimeInSeconds,
        ContentType: 'image/jpeg',
    };
    const s3 = getS3Instance();
    const uploadUrl = s3.getSignedUrl('putObject', params);
    return uploadUrl;
};
exports.getUploadUrl = getUploadUrl;
const getObjectList = async () => {
    try {
        const bucketName = getBucketName();
        const prefix = getBucketPrefix();
        const s3 = getS3Instance();
        const data = await s3
            .listObjectsV2({ Bucket: bucketName, Prefix: prefix })
            .promise();
        if (!data.Contents) {
            throw new Error('no s3 objects');
        }
        data.Contents.shift();
        return data.Contents.reduce((acc, { Key }) => (Key ? [...acc, Key] : acc), []);
    }
    catch (error) {
        console.error("Error in 'getObjectList'");
        return [];
    }
};
exports.getObjectList = getObjectList;
const s3Utils = {
    getUploadUrl: exports.getUploadUrl,
    getObjectList: exports.getObjectList,
};
exports.default = s3Utils;
