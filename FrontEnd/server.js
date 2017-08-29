var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var file = require('fs');
//calc.world();
var app = express();

app.use(express.static("."));
app.listen(8080, function() {
  console.log('server running...');
});

app.get('/getUser', function(req, res) {
  var userJson = file.readFileSync('./data/sampleUser.json', 'utf8');
  res.send(userJson);

});

app.post('/getProject', function(req, res) {
  var projJson = file.readFileSync('./data/sampleProject.json', 'utf8');
  res.send(projJson);
});