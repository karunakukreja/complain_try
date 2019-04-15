var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var json_encode = require('json_encode');
var array = require('node-array'); 
//var assArray = require('associative-array'); 

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
	response.sendFile(path.join(__dirname + '/complainListTry.html'));
    
    
});

app.get('/tables', function(request, response) {
   /* window.$ = window.jquery = require('./node_modules/jquery');
window.dt = require('./node_modules/datatables.net')();
window.$('#complaint_list').DataTable();*/
   
    var data = []; 
    var i; 
			connection.query('SELECT * FROM complaints', function(error, results, fields){
                 
                
                if(error){
                    console.log(error); 
                }else{
                    console.log(results);
                
                    for( i=0; i<results.length; i++){
                        var sub_array = [];                    
                        sub_array.push([results[i].c_id, results[i].c_description,"<button class='edit fa fa-pencil btn blue' id="+results[i].c_id+"' data-toggle='modal' data-target='#editModal'></button>" ]);
                       // console.log(sub_array[i]);
                   /* sub_array[j].push(results[i].c_description);
                                               // console.log(sub_array[i+1]);
                    sub_array[j].push("<button class='edit fa fa-pencil btn blue' id="+results[i].c_id+"' data-toggle='modal' data-target='#editModal'></button>"); 
                                               // console.log(sub_array[i+2]);*/
                     data.push(sub_array);
                        
                        
                }
                    console.log(data);
                    var encoded = JSON.parse(data);
                    console.log(encoded);
                }
            });
    
    /*var output = new assArray(); 
    output.push("data",data[] ); */
    /*var output = array(
    "draw" => intval($_POST['draw']),
    "recordsTotal" => get_all_data($connection),
    "recordsFiltered" => $number_filtered_row,
    "data" => $data,
    );
json_encode($output);*/
    
			response.end();
		});

app.listen(3000);