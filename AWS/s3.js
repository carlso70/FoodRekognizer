const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
let s3 = new AWS.S3();
// let bucketName = 'food-bucketd2c88523-e01b-47d3-9deb-74d8b20ea6f1';

/* Create a new S3 bucket to work with using the given name*/
function createBucket(bucketName) {
    return s3.createBucket({ Bucket: bucketName }).promise();
}

/* Delete a bucket of given name in the aws sdk */
async function deleteBucket(bucket) {
	await s3.deleteBucket(params = { Bucket: bucket }, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else console.log(data);           // successful response
	});
}

/* List all available buckets in the user's s3 console */
function listBuckets() {
	return new Promise((resolve, reject) => {
		s3.listBuckets((err, data) => {
			if (err) reject(err);
			else resolve(data);           // successful response
		});
	})
}

/* Empties an s3 directory, allowing it to be deleted after */
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

/* Deletes all buckets in a user's s3 console */
function deleteAllBuckets() {
	listBuckets().then(list => {
		for (let i in list.Buckets) {
            /* Wait for the emptyS3Directory function to complete before deleting it */
			emptyS3Directory(list.Buckets[i].Name, '/').then(deleteBucket(list.Buckets[i].Name));
		}
	}).catch(err => reject(err));
}
