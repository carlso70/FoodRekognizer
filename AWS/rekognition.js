const fs = require('fs'),
    AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
// Create an sdk AWS.Rekognition object
let rekognition = new AWS.Rekognition();

function testUploadPhotoToBucket(bucketName, keyName, photoLocation) {
    // Handle promise fulfilled/rejected states
    return new Promise((resolve, reject) => {
        // Create params for putObject call
        let objectParams = {
            Bucket: bucketName,
            Key: keyName,
            Body: fs.createReadStream(photoLocation)
        };
        /* Create and upload object into bucket */
        var uploadPromise = new AWS.S3().putObject(objectParams).promise();
        uploadPromise.then((data) => {
            console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
            resolve(keyName);
        }).catch((err) => {
            // console.error(err, err.stack);
            console.log("In test upload to photo");
            reject(err);
        });
    });
}

function testDetectLabels(bucketName, imgName) {
    /* This operation detects the labels in the supplied image */
    let params = {
        Image: {
            S3Object: {
                Bucket: bucketName,
                Name: imgName
            }
        },
        MaxLabels: 123,
        MinConfidence: 70
    };

    rekognition.detectLabels(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
}