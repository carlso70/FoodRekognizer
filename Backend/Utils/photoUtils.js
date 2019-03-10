const fs = require('fs'),
    cloudconvert = new (require('cloudconvert'))(process.env.CLOUDCONVERT); /* API KEY set to env variable CLOUDCONVERT */

module.exports = {
    /* Use CloudConvert to convert a photo file type of HEIC to PNG */
    convertHEICtoPNG: function (inputFileName) {
        let outputFileName = inputFileName.split('.heic')[0] + '.png';
        return this.convertPhoto(inputFileName, outputFileName, 'heic', 'png');
    },

    convertPhoto: function (inputFileName, outputFileName, fromFormat, toFormat) {
        return new Promise((resolve, reject) => {
            try {
                fs.createReadStream(inputFileName)
                    .pipe(cloudconvert.convert({
                        inputformat: fromFormat,
                        outputformat: toFormat,
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

}