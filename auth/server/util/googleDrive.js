const { google } = require("googleapis");
const express = require('express');
const router = express.Router();
const db = require('../models');
const fs = require("fs");
const async = require('async');


function listFiles(auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({pageSize: 10, fields: 'nextPageToken, files(id, name)'})
    .then(res =>{
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
            console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    })
    .catch(err =>{
        console.log('The API returned an error: ' + err)
    })}


function createFile(auth){
    const drive = google.drive({version: 'v3', auth});
    drive.files.create({
        requestBody: {
            name: 'Test',
            mimeType: 'text/plain'
          },
          media: {
            mimeType: 'text/plain',
            body: 'Hello World. This is Andrea creating a file from the terminal.'
          }
      })
      .then(res =>{
        console.log(res.data);
      })
      .catch(err =>{
        console.log(err);
      })
}

function createJSFolder(auth){
    const drive = google.drive({version: 'v3', auth});
    let fileMetadata = {
        'name': 'JavaScript',
        'mimeType': 'application/vnd.google-apps.folder'
    };

    drive.files.create({
        resource: fileMetadata,
        fields: 'id'
        }, async function (err, file) {
        if (err) {
          // Handle error
            console.error(err);
        } else {
            console.log("File Name: ", file.config.data.name, " File ID: ", file.data.id);

            let storedJSFolder = await db.userFolders.create({
                userID: 1,
                folderID: file.data.id,
                folderName: file.config.data.name
            })
        }
    });

}

async function createJSFile(auth){
    const drive = google.drive({version: 'v3', auth});
    try{
        let folderJS = await db.userFolders.findAll({where: {userID: 1, folderName: "JavaScript"}}, {raw: true})

        let folderID = folderJS[0].dataValues.folderID;
        console.log(folderID)

        let fileMetadata = {
            'name': 'photo.py',
            parents: [folderID]
        };
        let media = {
        mimeType: 'text/plain',
        body: `
        const express = require('express');
        const app = express();
        
        app.set('view engine', 'ejs');
        
        app.use(express.static('public'));
        
        app.use(require('./routes/index'))
        
        
        
        app.listen(3000, () => {
            console.log('Listening on Port 3000');
        })
        `
        };
        drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
        }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.data.id);
        }
    });

    } catch(error){
        console.log(error)
    }
    
}

function findFilesInFolder(auth){
    const drive = google.drive({version: 'v3', auth});
    let pageToken = null;
// Using the NPM module 'async'
    async.doWhilst(function (callback) {
    drive.files.list({
        q: "'1aLcSATR5P9tm6jOp8Y5ec9iICYAG_U0d' in parents",
        fields: 'files(id, name, mimeType)',
        spaces: 'drive',
        pageToken: pageToken
    }
    , function (err, res) {
        if (err) {
        // Handle error
        console.error(err);
        callback(err)
        } else {
        res.data.files.forEach(function (file) {
            console.log('Found file: ', file.name, file.id);
            const dest = fs.createWriteStream('/temp/photo.jpg')
            drive.files.get({fileId: "1fL81q6zIb1r42H6Ux2ADgkMIG2jp0PrF", alt: 'media'}, {responseType: 'stream'},
                function(err, res){
                    res.data
                    .on('end', () => {
                        console.log('Done');
                    })
                    .on('error', err => {
                        console.log('Error', err);
                    })
                    .pipe(dest);
                }
            );
        });

        pageToken = res.nextPageToken;
        callback();
        }
    });
    }, function () {
    return !!pageToken;
    }, function (err) {
    if (err) {
        // Handle error
        console.error(err);
    } else {
        // All pages fetched
    }
    }
    )




    // var pageToken = null;
    // // Using the NPM module 'async'
    // async.doWhilst(function (callback) {
    // drive.files.list({
    //     q: `1aLcSATR5P9tm6jOp8Y5ec9iICYAG_U0d in parents`,
    //     fields: 'nextPageToken, files(id, name)',
    //     spaces: 'drive',
    //     pageToken: pageToken,
    // }, function (err, res) {
    //     if (err) {
    //     // Handle error
    //     console.error(err);
    //     callback(err)
    //     } else {
    //     res.files.forEach(function (file) {
    //         console.log('Found file: ', file.name, file.id);
    //     });
    //     pageToken = res.nextPageToken;
    //     callback();
    //     }
    // });
    // }, function () {
    // return !!pageToken;
    // }, function (err) {
    // if (err) {
    //     // Handle error
    //     console.error(err);
    // } else {
    //     // All pages fetched
    // }
    // })
}


const drive = {
    listFiles,
    createFile,
    createJSFolder,
    createJSFile,
    findFilesInFolder
}

module.exports = drive;
