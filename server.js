
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.static(__dirname + '/public'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000000 }));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/epa.html'));
});


app.post('/save', function(request, response) {
  //saveFile(request.query.url, request.body.body);
 console.log(request)
 console.log(request.body)
  fs.writeFile("output.json", JSON.stringify(request.body), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
  });

});

console.log('The EPA Server is running in url : http://127.0.0.1:8080');
app.listen(8080);