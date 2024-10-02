const { s3 } = require('../middlewares/aws.middleware');

const uploadToAWS = (params) => {
    return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const getAllDocument = (params) => {
    return new Promise((resolve, reject) => {
        s3.listObjectsV2(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const deleteToAWS = (params) => {
    return new Promise((resolve, reject) => {
        s3.deleteObject(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = {
    getAllDocument,
    uploadToAWS,
    deleteToAWS
}