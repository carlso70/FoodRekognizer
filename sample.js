const fs = require('fs'),
	AWS = require('aws-sdk'),
	uuid = require('uuid'),
	cloudconvert = new (require('cloudconvert'))(process.env.CLOUDCONVERT); /* API KEY set to env variable CLOUDCONVERT */

AWS.config.update({ region: 'us-east-1' });

/* Test data */
// Create unique bucket name
// let bucketName = 'food-bucket' + uuid.v4();
let bucketName = 'food-bucketd2c88523-e01b-47d3-9deb-74d8b20ea6f1';
// Create name for uploaded object key
let keyName = 'Cake';

let s3 = new AWS.S3();

// Create a promise on S3 service object
function createBucket() {
	return AWS.S3().createBucket({ Bucket: bucketName }).promise();
}

async function deleteBucket(bucket) {
	await s3.deleteBucket(params = { Bucket: bucket }, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else console.log(data);           // successful response
	});
}

function listBuckets() {
	return new Promise((resolve, reject) => {
		s3.listBuckets((err, data) => {
			if (err) {
				// console.log(err, err.stack); // an error occurred
				reject(err);
			}
			else resolve(data);           // successful response
		});
	})
}

async function emptyS3Directory(bucket, dir) {
	const listParams = {
		Bucket: bucket,
		Prefix: dir
	};

	const listedObjects = await s3.listObjectsV2(listParams).promise();

	if (listedObjects.Contents.length === 0) return;

	const deleteParams = {
		Bucket: bucket,
		Delete: { Objects: [] }
	};

	listedObjects.Contents.forEach(({ Key }) => {
		deleteParams.Delete.Objects.push({ Key });
	});

	await s3.deleteObjects(deleteParams).promise();

	if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

function deleteAllBuckets() {
	listBuckets().then(list => {
		for (let i in list.Buckets) {
			emptyS3Directory(list.Buckets[i].Name, '/')
			deleteBucket(list.Buckets[i].Name);
		}
	}).catch(err => reject(err));
}

// Create a sample AWS.Rekognition object
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

function convertHEICtoPNG(inputFileName, outputFileName) {
	return new Promise((resolve, reject) => {
		try {
			fs.createReadStream(inputFileName)
				.pipe(cloudconvert.convert({
					inputformat: 'heic',
					outputformat: 'jpg',
					converteroptions: {
						quality: 75,
					}
				}))
				.pipe(fs.createWriteStream(outputFileName))
				.on('finish', () => resolve(outputFileName));
		} catch (error) {
			reject(error);
		}
	});

}

// testUploadPhotoToBucket(bucketName, keyName, bodyStream).then(res => testDetectLabels(bucketName, keyName));
//deleteAllBuckets();
convertHEICtoPNG('cake.HEIC', 'cake.jpg').then(result => {
	testUploadPhotoToBucket(bucketName, keyName, result).then(response => {
		testDetectLabels(bucketName, keyName);
	});
});