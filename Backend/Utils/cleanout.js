/* Use of this script is to clean out data from uploads folder */
const fs = require('fs');
const path = require('path');

const uploadsDirectories = ['uploads'];

for (const directory of uploadsDirectories) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
    console.log(`Cleaned out ${directory}....`);
}
