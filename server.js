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
console.log(pswd);
pswd = pswd.trim();

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

app.post('/getUsersName', function(req, res) {
	var userJson = file.readFileSync('./data/sampleUser.json', 'utf8');
	res.send(userJson);
});

app.post('/login', function(req, res) {
	res.send("success");
});


/*
 * Get project by ID
 */
app.post('/getProject', function(req, res) {
	console.log('Retrieving data for ProjectID = ' + req.body.ProjectID);

	var q = new query();
	q.once("success", function(project){
		res.send(project);
	});
	q.getProject(con, req.body.ProjectID);
	
	// ####### DEPRECATED #######
	/*con.query("SELECT * FROM projects WHERE ProjectID = " + req.body.ProjectID + ";", function(err, rows, cols) {
		if (err) {
			console.log("Error during query execution: " + err);
			res.send(err);
		}
		else {
			console.log(rows);
			res.send(rows);
		}
	});*/
});


/*
 * Get user by ID
 */
app.post('/getUser', function(req, res) {
	var q = new query();
	q.once("success", function(user){
		res.send(user);
	});
	q.getUser(con, req.body.UserID);

	/* ####### DEPRECATED #######
	con.query("SELECT * FROM Users WHERE UserID = " + req.query.userID + ";", function(err, rows, cols) {
		if (err) {
			console.log("Error during query execution: " + err);
			res.send(err);
		}
		else {
			console.log(rows);
			res.send(rows);
		}
	});*/
});


/*
 * Search projects in the db with or without filters.
 * Expects filters to be a JSON object.
 */
app.post("/searchProjects", function(req, res) {
	var q = new query();
	q.once("success", function(projects){
		console.log(projects);
		res.send(projects);
	});
	q.getAllProjects(con, req.body.filters)
});
	

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

/*
 * Insert a project into the database
 */
app.post("/createProject", function(req, res){
	con.query("INSERT INTO Projects (Title, Tagline, Description, TimelineID, ProjectTypeID, UserID, AcademicStatusID, MajorID)" +
		  "VALUES ('" + req.body.title + "', '" + req.body.tline + "', '" + req.body.description + "', '" + req.body.timelineId + "', '" 
		  + req.body.projectTypeId + "', '" + req.body.userId + "', '" + req.body.academicStatusId + "', '" + req.body.majorId + "')",
		  function(err, result){
		  	if (err){
				console.log(err);
				res.send("Failure");
			}
			else{
				console.log("Successfully posted project ");
				res.send("Success");
			}
		  });
});
