const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/json', function (req, res) {
  var obj = {firstKey: "The first key", secondKey: 2, guess: "Third Key"}
  res.setHeader("Content-Type","application/json")
  res.send(JSON.stringify(obj))
})

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
})