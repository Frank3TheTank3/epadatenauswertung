
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json())

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/epa.html'));
});

console.log('The EPA Server is running in url : http://127.0.0.1:8080');
app.listen(8080);