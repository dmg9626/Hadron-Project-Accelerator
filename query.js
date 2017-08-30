var EventEmitter = require("events").EventEmitter;
var utils = require("util");

function Query(){
	EventEmitter.call(this);
}
utils.inherits(Query, EventEmitter);

Query.prototype.getUser = function(con, studentJson){
	var self = this;
	con.query("SELECT u.UserID, u.FirstName, u.LastName, cm.Major, cas.Status FROM Users AS u" +
		  "JOIN Criteria_Major AS cm ON u.MajorID = cm.MajorID" +
		  "JOIN Criteria_AcademicStatus AS cas ON u.AcademicStatusID = cas.AcademicStatusID" +
		  	"WHERE FirstName = '" + studentJson.firstName + "'" +
		       	"AND LastName = '" + studentJson.lastName + "'",
			function(err, rows, fields){
				if (err){
					console.log(err);
				}
				else{
					rows.forEach(function(r){
						var user = {
							uid: r["UserID"],
							fname: r["FirstName"],
							lname: r["LastName"],
							major: r["Major"],
							acstat: r["Status"]
						};
					});
				}
			}

}
