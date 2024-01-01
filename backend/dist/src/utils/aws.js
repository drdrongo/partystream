"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUploadUrl = void 0;
const aws_sdk_1 = require("aws-sdk");
const getBucketParams = () => {
    const s3 = new aws_sdk_1.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'ap-northeast-1',
    });
    const bucketName = 'partystream-1';
    const key = 'dev/plant-1.jpeg';
    const expirationTimeInSeconds = 300;
    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: expirationTimeInSeconds,
        ContentType: 'image/jpeg',
    };
    return [s3, params];
};
const getUploadUrl = () => {
    const [s3, params] = getBucketParams();
    const uploadUrl = s3.getSignedUrl('putObject', params);
    console.log('Secure upload URL:', uploadUrl);
    return uploadUrl;
};
exports.getUploadUrl = getUploadUrl;
const s3Utils = {
    getUploadUrl: exports.getUploadUrl,
};
exports.default = s3Utils;
