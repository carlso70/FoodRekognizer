const s3 = require('../AWS/s3.js');

s3.getFoodBucket().then(bucket => s3.emptyS3Directory(bucket, '/')).catch(error => console.error(error));