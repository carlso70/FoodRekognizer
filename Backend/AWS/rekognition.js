const fs = require('fs'),
    AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
// Create an sdk AWS.Rekognition object
let rekognition = new AWS.Rekognition();

module.exports = {
    detectLabels: (bucketName, keyName) => {
        /* This operation detects the labels in the supplied image */
        let params = {
            Image: {
                S3Object: {
                    Bucket: bucketName,
                    Name: keyName
                }
            },
            MaxLabels: 123,
            MinConfidence: 70
        };

        /* Fetch the labels from the aws rekognigiton service */
        return new Promise((resolve, reject) => {
            rekognition.detectLabels(params, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
};