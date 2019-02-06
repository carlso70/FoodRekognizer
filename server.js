const rekognition = require('./AWS/rekognition.js'),
    s3 = require('./AWS/s3.js'),
    foodDetection = require('./FoodDetection/foodDetection.js'),
    photoUtils = require('./Utils/photoUtils.js'),
    express = require('express'),
    crypto = require('crypto'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mime = require('mime'),
    next = require('next'),
    multer = require('multer'),
    dev = process.env.NODE_ENV !== 'production',
    app = next({ dev }),
    handle = app.getRequestHandler(),
    PORT = process.env.PORT || 8080;

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
    /* Kill the app because there is no s3 bucket */
    throw new Error("NO S3 BUCKET TO RUN");
});


/* Define multer upload settings for multiform data */
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


app.prepare()
    .then(() => {
        const server = express()
        server.use(cors({ credentials: true, origin: true }));
        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json());

        server.get('*', (req, res) => {
            return handle(req, res)
        });

        /* 
         *  Upload a photo, and detect labels in it
         */
        server.post('/api/detectPhotoLabels', upload.single('photo'), (req, res) => {
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
        server.post('/api/detectCalories', upload.single('photo'), (req, res) => {
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


        /* Listen to the App Engine-specified port, or 8080 otherwise */
        server.listen(PORT, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${PORT}`);
        })
    })
    .catch((ex) => {
        console.error(ex);
        process.exit(1);
    });
