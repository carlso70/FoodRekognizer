const AWS = require('aws-sdk'),
	fs = require('fs'),
	uuid = require('uuid');

AWS.config.update({ region: 'us-east-1' });
let s3 = new AWS.S3();

module.exports = {

	/* Get food bucket for storing photos, if there isn't one, create one */
	getFoodBucket: () => {
		return new Promise((resolve, reject) => {
			s3.listBuckets((err, data) => {
				/* Return the bucket with the food identifier if it exist */
				for (const bucket of data.Buckets) {
					if (bucket.Name.indexOf('food') > -1) resolve(bucket.Name);
				}

				/* Create a new food bucket and return the name since once doesn't exist*/
				const bucketName = 'food' + uuid.v4();
				let bucket = s3.createBucket({ Bucket: bucketName }).promise();
				bucket.then(resolve(bucketName))
					.catch(err => reject(err));
			});
		});
	},

	/* Create a new S3 bucket to work with using the given name*/
	createBucket: async (bucketName) => {
		return s3.createBucket({ Bucket: bucketName }).promise();
	},

	deleteBucket: async (bucket) => {
		/* Delete a bucket of given name in the aws sdk */
		await s3.deleteBucket(params = { Bucket: bucket }, function (err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log(data);           // successful response
		});
	},

	/* List all available buckets in the user's s3 console */
	listBuckets: () => {
		return new Promise((resolve, reject) => {
			s3.listBuckets((err, data) => {
				if (err) reject(err);
				else resolve(data);           // successful response
			});
		});
	},

	/* Empties an s3 directory, allowing it to be deleted after */
	emptyS3Directory: async (bucket, dir) => {
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
		console.log(`Deleted objects ${deleteParams.Delete.Objects} from ${deleteParams.bucket}`);

		if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
	},

	/* Deletes all buckets in a user's s3 console */
	deleteAllBuckets: () => {
		listBuckets().then(list => {
			for (let i in list.Buckets) {
				/* Wait for the emptyS3Directory function to complete before deleting it */
				emptyS3Directory(list.Buckets[i].Name, '/').then(deleteBucket(list.Buckets[i].Name));
			}
		}).catch(err => console.error(err));
	},

	uploadPhotoToBucket: (bucketName, keyName, photoLocation) => {
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
}