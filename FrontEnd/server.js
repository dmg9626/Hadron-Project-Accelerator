var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var file = require('fs');
var query = require("./query");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var filePath = require("path").join(__dirname, "db_pswd");
var fs = require('fs');
var pswd = fs.readFileSync(filePath).toString();

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: pswd,
	database: "hadronprojectaccelerator"
});
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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

app.post('/getUsersName', function(req, res) {
	var userJson = file.readFileSync('./data/sampleUser.json', 'utf8');
	res.send(userJson);
});

app.post('/login', function(req, res) {
	res.send("success");
});

/*
 * Search projects in the db with or without filters.
 * Expects filters to be a JSON object.
 */
app.post("/searchProjects", function(req, res) {
	var q = new query();
	q.once("success", function(projects){
		res.send(projects);
	});
	q.getAllProjects(con, req.body.filters)
})
	

/*
 * Insert a new user into the database
 */
app.post("/createUser", function(req, res){
	con.query("INSERT INTO Users (FirstName, LastName, Email, MajorID, AcademicStatusID)" +
		  "VALUES (" + req.body.fname + ", " + req.body.lname + ", " + req.body.email + ", " + req.body.majorID + ", " + req.body.academicStatusID + ")",
		  function(err, result){
		  	if (err){
				console.log(err);
				res.send("Failure");
			}
			else{
				console.log("Successfully added user to DB.");
				res.send("Success");
			}
		  });
});
