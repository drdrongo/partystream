"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadUrl = void 0;
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const getBucketParams = (fileExtension) => {
    const s3 = new aws_sdk_1.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    const bucketName = process.env.BUCKET_NAME ?? '';
    const key = `${process.env.BUCKET_ENV ?? 'dev'}/${(0, uuid_1.v4)()}.${fileExtension}`;
    const expirationTimeInSeconds = Number(process.env.URL_EXPIRATION_TIME) || 300;
    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: expirationTimeInSeconds,
        ContentType: 'image/jpeg',
    };
    return [s3, params];
};
const getUploadUrl = (fileExtension) => {
    const [s3, params] = getBucketParams(fileExtension);
    const uploadUrl = s3.getSignedUrl('putObject', params);
    console.log('Secure upload URL:', uploadUrl);
    return uploadUrl;
};
exports.getUploadUrl = getUploadUrl;
const s3Utils = {
    getUploadUrl: exports.getUploadUrl,
};
exports.default = s3Utils;
