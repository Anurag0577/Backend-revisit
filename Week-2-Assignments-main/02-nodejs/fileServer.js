/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express'); // import express from express
const fs = require('fs'); // import fs library of JS
const path = require('path'); // path is a built in path module, which is used to handle or manipulate path of files or directory.
const app = express(); // create an instance of express library, store that in app variable.
const PORT  = 3000;

app.get('/files', (req, res) => {
  let folderPath = path.join(__dirname, '/files');
  console.log(folderPath);
  fs.readdir(folderPath, (err, data) => {
    res.status(200).send(data);
  })
})

app.get('/file/:filename', (req, res) => {
  let filePath = path.join(__dirname, './files' , req.params.filename);
  console.log(`file path: ${filePath}`);
  fs.readFile(filePath, (err, data) => {
    if(err){
      console.log("Something seems wrong!")
      res.status(404);
    }
    res.status(200).send(data);
  })
})

app.all('*', (req, res) => {
  res.status(404).send("Page not found!")
})


// listen all the request on 3000 port
app.listen(3000, () => {
  console.log("Server start running on 3000");
})


module.exports = app;
