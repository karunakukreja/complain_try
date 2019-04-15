var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'phpdb',
	password : 'phpdb',
	/////////////////////////////////////
	database : 'complaint_management'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/loginGroupProject.html'));
    
    
});

app.post('/auth', function(request, response) {
	var userId = request.body.userId;
	var email = request.body.email;
	var password = request.body.password;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	var userType = request.body.userType ;
    console.log("Bello");
    console.log("user id"+userId,email,password,userType);
	if (email && userId && userType && password) {
        
		connection.query('SELECT * FROM users WHERE user_id = ? AND user_email_id = ? AND user_password = ? ', [userId, email, password], function(error, results, fields) {
            console.log(results)
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
				//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				response.redirect('/home');
			} else {
				response.send('Incorrect User ID, Email, Password and/or User Type!');
			}			
			response.end();
		});
        
	} else {
        
		response.send('Please enter User ID, Email, Password and User Type!');
		response.end();
	}
});

//////////////////////////
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.email + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);