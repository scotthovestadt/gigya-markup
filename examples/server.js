const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;
app.use(express.static(__dirname + '/.'));
app.use(express.static(__dirname + '/../build'));
app.get('*/gy.js', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../dist/gy.js'));
});
app.get('*/gy.js.map', function(req, res, next) {
  res.sendFile(path.resolve(__dirname + '/../dist/gy.js.map'));
});
app.listen(port);
console.log('Starting server on port ' + port);