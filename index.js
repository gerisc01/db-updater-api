// Require express
const express = require('express')
const bodyParser = require('body-parser');
// Require isomorphic-fetch
require('es6-promise').polyfill();
require('isomorphic-fetch');
// Require the filesystem
const fs = require('fs');

// Attempt to retrieve the api_key from the environment variable.
let apiKey = process.env.API_KEY;
// If the apiKey could not be loaded from the environment variable, attempt to load it from the
// file system (.api_key)
if (!apiKey) {
  fs.readFile(".api_key", "utf8", function(err,data) {
    if (err) {
      console.log(err);
    } else {
      apiKey = data.trim();
    }
  })
}

const app = express()
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.put('/api/v1/gistdb/:gistId/:fileName', function (req, res) {
  let url = 'https://api.github.com/gists/'+req.params.gistId
  let data = {
    'files': {
      [req.params.fileName]: {
        'content': JSON.stringify(req.body)
      }
    }
  }

  fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+apiKey,
      'User-Agent': 'Media-Queue-Database-Updater'
    },
    method: 'PATCH',
    body: JSON.stringify(data)
  }).then(function(response) {
    responseCode = response.status;
    return response.json(); })
  .then(function(json) {
    responseData = json;
    res.status(responseCode)
    res.setHeader("Content-Type","application/json")
    res.send(JSON.stringify(responseData))
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port '+(process.env.PORT || 3000))
})