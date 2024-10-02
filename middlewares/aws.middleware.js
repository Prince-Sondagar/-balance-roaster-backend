const AWS = require('aws-sdk');
const { awsAccessKey, awsSecretKey, region } = require('../config');

const config = {
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey
  },
  region: region
};

const s3 = new AWS.S3(config);

module.exports = {s3};