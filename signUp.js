var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'phpdb',
	password : 'phpdb',
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	database : 'complaint_management'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/signUp.html'));
});

app.post('/auth', function(request, response) {
	var userId = request.body.userId;
	var email = request.body.email;
	var password = request.body.password;
	var userType = request.body.userType;

	if (email && userId && userType && password ) {
		
		connection.query('SELECT * FROM users WHERE user_id = ? OR user_email_id = ? ', [userId, email], function(error, results, fields) {
            
			if (results.length > 0) {
				response.send('User already exists');
			} else {
				connection.query("INSERT INTO users (user_email_id, user_password) VALUES('"+email+"', '"+password+"')",function(error, results, fields) {
						console.log("insert successful");
                        console.log(error);
				});
			
			}			
			response.end();
		});
	} else {
		response.send('Please enter User ID, Email, Password and User Type!');
		response.end();
	}
});

app.listen(3000);
