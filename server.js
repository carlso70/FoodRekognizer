const rekognition = require('./AWS/rekognition.js'),
    s3 = require('./AWS/s3.js'),
    photoUtils = require('./Utils/photoUtils.js'),
    express = require('express'),
    app = express(),
    crypto = require('crypto'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mime = require('mime'),
    multer = require('multer');

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* 
 *  Upload a photo, and detect labels in it
 */

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
    }
});
var upload = multer({ storage: storage });
app.post('/detectPhotoLabels', upload.single('photo'), (req, res) => {
    console.log(req.file); /* holds the file */
    console.log(req.body); /* holds the body if there is one */
    photoUtils.convertHEICtoPNG(req.file.path);
    res.sendStatus(200);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});