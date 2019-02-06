const s3 = require('./AWS/s3.js'),
    rekognition = require('./AWS/rekognition.js'),
    foodDetection = require('./FoodDetection/foodDetection.js'),
    photoUtils = require('./Utils/photoUtils.js'),
    express = require('express'),
    crypto = require('crypto'),
    mime = require('mime'),
    multer = require('multer'),
    router = express.Router();

/* 
 * Name of the s3 bucket we will use to store photos for label detection,
 * If no bucket can be created or found, app should throw error and kill itself
 */
let bucketName;
s3.getFoodBucket().then(result => {
    bucketName = result;
    console.log(`Bucketname: ${bucketName}`);
}).catch(err => {
    console.error(err);
    console.error("NO S3 BUCKET TO RUN");
    /* Kill the app because there is no s3 bucket to work with*/
    process.exit(1);
});

/* 
 * Define multer upload settings for multiform data (food photos) 
 */
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
    }
});
let upload = multer({ storage: storage });

/* 
 *  Upload a photo, and detect labels in it
 */
router.post('/detectPhotoLabels', upload.single('photo'), (req, res) => {
    console.log(req.file); /* holds the file */
    console.log(req.body); /* holds the body if there is one */

    /* Convert given photo */
    photoUtils.convertHEICtoPNG(req.file.path)
        .then(outputFile => {
            console.log(`Converted file: ${outputFile}`);

            /* Upload converted png to s3 bucket */
            s3.uploadPhotoToBucket(bucketName, req.file.originalname, outputFile)
                .then(keyName => {
                    console.log(`File uploaded: ${keyName}`);
                    /* TODO Delete photo from local file system */

                    /* Detect the labels of the photo */
                    rekognition.detectLabels(bucketName, keyName).then(labels => {
                        /* Respond with the labels of the photo */
                        res.send(labels);
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.sendStatus(500);
                })
        }).catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});
/**************************** END DETECT PHOTO LABELS *************************************/

/* 
 * DETECT CALORIES - upload a picture, process it to s3, check labels using rekognition,
 * then check for food and detect potential calories
 */
router.post('/detectCalories', upload.single('photo'), (req, res) => {
    /* Convert given photo */
    photoUtils.convertHEICtoPNG(req.file.path)
        .then(outputFile => {
            console.log(`Converted file: ${outputFile}`);

            /* Upload converted png to s3 bucket */
            s3.uploadPhotoToBucket(bucketName, req.file.originalname, outputFile)
                .then(keyName => {
                    console.log(`File uploaded: ${keyName}`);
                    /* TODO Delete photo from local file system */

                    /* Detect the labels of the photo */
                    rekognition.detectLabels(bucketName, keyName).then(labels => {
                        if (labels.Labels) {
                            /* Check the labels with the food database */
                            foodDetection.parseLabelDataForFood(labels.Labels)
                                .then(result => {
                                    console.log(result)
                                    res.send(result);
                                })
                                .catch(err => {
                                    console.error(err);
                                    res.sendStatus(500);
                                });
                        } else {
                            res.sendStatus(500);
                        }
                    });
                })
                .catch(err => {
                    console.error(err);
                    res.sendStatus(500);
                })
        });
});
/*********************************** END DETECT CALORIES ***************************************/

module.exports = router;
