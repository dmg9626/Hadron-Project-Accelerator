var EventEmitter = require("events").EventEmitter;
var utils = require("util");

function Query(){
	EventEmitter.call(this);
}
utils.inherits(Query, EventEmitter);

/*
 * Query the db for a specific user
 */
Query.prototype.getUser = function(con, studentJson){
	var user = {};
	var self = this;
	con.query("SELECT u.FirstName, u.LastName, u.UserImage, cm.Major, cas.Status FROM Users AS u" +
		  "JOIN Criteria_Major AS cm ON u.MajorID = cm.MajorID" +
		  "JOIN Criteria_AcademicStatus AS cas ON u.AcademicStatusID = cas.AcademicStatusID" +
		  	"WHERE FirstName = '" + studentJson.firstName + "'" +
		       	"AND LastName = '" + studentJson.lastName + "'",
			function(err, rows, fields){
				if (err){
					console.log(err);
				}
				else{
					var r = row[0];
					user = {
						fname: r["FirstName"],
						lname: r["LastName"],
						img: r["UserImage"],
						major: r["Major"],
						acstat: r["Status"]
					};
				}
				self.emit("success", user); // emit user data
			});
}

/*
 * Query the db for a specific project
 * Expects a projectID as the search filter
 */
Query.prototype.getProject = function(con, pid){
	var project = {};
	var self = this;
	con.query("SELECT p.Title, p.Tagline, p.Description, " +
		  "cpt.Type, " +
		  "cas.Status, " + 
		  "cm.Name, " +
		  "ct.Timeline, " +
		  "u.FirstName, u.LastName, u.Email " +
		  "FROM Projects " +
		  "JOIN Users AS u ON p.UserID = u.UserID " +
		  "JOIN Criteria_ProjectType AS cpt ON p.ProjectTypeID = cpt.ProjectTypeID " +
		  "JOIN Criteria_AcademicStatus AS cas ON p.AcademicStatusID = cas.AcademicStatusID " +
		  "JOIN Criteria_Major AS cm ON p.MajorID = cm.MajorID " +
		  "JOIN Criteria_Timeline AS ct ON p.TimelineID = ct.TimelineID " +
		  "WHERE p.ProjectID = '" + pid + "'",
			function(err, rows, fields){
				if (err){
					console.log(err);
				}
				else{
					var r = row[0];
					project = {
						title: r["Title"],
						tag: r["Tagline"],
						desc: r["Description"],
						type: r["Type"],
						maj: r["Name"],
						timeline: r["Timeline"],
						fname: r["FirstName"],
						lname: r["LastName"],
						email: r["Email"]
					};
				}
				self.emit("success", project); // emit project data
			});
}

/*
 * Search for projects in the DB.
 * User can specify filters (optional)
 */
Query.prototype.getAllProjects = function(con, filters){
	var projects = Array();
	var self = this;
	var query = "SELECT p.Title, p.Tagline, p.Description," +
		    "ct.Timeline, pt.Type, u.FirstName, u.LastName" +
		    "FROM Projects AS p " +
		    "JOIN Criteria_Timeline AS ct ON p.TimelineID = ct.TimelineID " +
		    "JOIN Criteria_ProjectType AS cpt ON p.ProjectTypeID = cpt.ProjectTypeID " +
	  	    "JOIN Users AS u ON p.UserID = u.UserID " +
		    "JOIN Criteria_AcademicStatus AS cas ON u.AcademicStatusID = cas.AcademicStatusID " + 
		    "JOIN Criteria_Major AS cm ON u.MajorID = cm.MajorID ";

	// add any filters the user may have spcified
	if (filters){
		var addedWhereClause = 0;
		if (filters.timelineID){
			query += "WHERE ct.TimelineID = '" + filters.timelineID + "' ";
			addedWhereClause = 1;
		}
		
		if (filters.academicStatusID){
			if (addedWhereClause) 
				query += "AND ";
			else
				addedWhereClause = 1;

			query += "WHERE cas.AcademicStatusID = '" + filters.academicStatusID + "' ";
		}

		if (filters.majorID){
			if (addedWhereClause)
				query += "AND ";
			
			query += "WHERE cm.MajorID = '" + filters.majorID + "'";
		}
	}

	con.query(query,
		  	function(err, rows, fields){
				if (err){
					console.log(err);
				}
				else{
					rows.forEach(function(r){
						var project = {
							title: r["Title"],
							tag: r["Tagline"],
							desc: r["Description"],
							timeline: r["Timeline"],
							type: r["Type"],
							fname: r["FirstName"],
							lname: r["LastName"]
						};
						projects.push(project);
					});
				}
				self.emit("success", projects); // emit success and projects array
			});
}

utils.inherits(Query, EventEmitter);
module.exports = Query;
