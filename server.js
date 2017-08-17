var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var file = require('fs');
//calc.world();
var app = express();

app.use(express.static("."));
app.listen(8080, function() {
  console.log('server running');
});

app.get('/getUser', function(req, res) {
  var userJson = file.readFileSync('./data/sampleUser.json', 'utf8');
  res.send(JSON.parse(userJson));

  /*
  var seed = parseInt(req.query.seed);
  if(seed < 0) {
    res.send("Invalid seed (must be a positive value)");
  }
  else {
    calc.once('fact', function(msg) {
      res.send(msg);
    });
    calc.fact(seed);
  }
  */
});

/*
app.get('/computeSum', function(req, res) {
  var seed = parseInt(req.query.seed);
  if(seed < 0) {
    res.send("Invalid seed (must be a positive value)");
  }
  else {
    calc.once('sum', function(msg) {
      res.send(msg);
    });
    calc.sum(seed);
  }
});
*/
