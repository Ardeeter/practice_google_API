const express = require('express');
const router = express.Router();
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const credentials = require('../credentials.json');
const drive = require('../util/googleDrive');
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
const db = require('../models');
const { file } = require('googleapis/build/src/apis/file');
let oAuth2Client = {}

router.get('/googleAuth', (req, res) => {
    let code = req.query.code;
    
    try{

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          
          oAuth2Client.getToken(code, async (err, token) => {
              if (err) return console.error("Error retrieving access token", err);
              oAuth2Client.setCredentials(token);
              // Store the token to disk for later program executions
              console.log(token.access_token, token.refresh_token, token.scope, token.token_type)
        
              let storedToken = await db.auth.create({
                  token: token.access_token,
                  refresh_token: token.refresh_token,
                  scope: token.scope,
                  token_type: token.token_type
              })
              
            let userToken = await db.auth.findAll({where: {id: 21}}, {raw: true})
            // console.log(userToken[0].dataValues.token)

            // console.log(drive.listFiles(userToken[0].dataValues.token));
            // console.log(drive.listFiles(oAuth2Client));
            // console.log(drive.createFile(oAuth2Client));
            console.log("=======================")
            // console.log(drive.createJSFolder(oAuth2Client));
            //console.log(drive.createJSFile(oAuth2Client));
            drive.findFilesInFolder(oAuth2Client);
            res.sendFile('/Users/ardeeter/digitalCraftsHomework/googleAuth/auth/server/photo.txt')
            
          //   let storedJSFolder = await db.userFiles.create({
          //     userID: 1,
          //     folderID: file.data.id,
          //     folderName: file.config.data.name
          // })

            
            
            });

        
    }
    catch(error){
        console.log('error while trying to get user token')
    }
              

})


router.post('/getURL', (req, res) => {
    

    try{
        fs.readFile("credentials.json", (err, content) => {
            if (err) return console.log("Error loading client secret file:", err);
            // Authorize a client with credentials, then call the Google Docs API.
            authorize(JSON.parse(content));
          });
         
          function authorize(credentials, callback) {
            const { client_secret, client_id, redirect_uris } = credentials.web;
            oAuth2Client = new google.auth.OAuth2(
              client_id,
              client_secret,
              redirect_uris[0]
            );
            // console.log(oAuth2Client)
            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
              if (err) return getNewToken(oAuth2Client, callback);
              oAuth2Client.setCredentials(JSON.parse(token));
              callback(oAuth2Client);
            });
          }

          

          function getNewToken(oAuth2Client, callback) {
            

            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: SCOPES,
              });
    
              console.log("Authorize this app by visiting this url:", authUrl);

              res.json(authUrl)
              
            // res.redirect(authUrl)

            
            
          }


    }
    catch(error){
        console.log('unable to make URL')
    }

})




module.exports = router;