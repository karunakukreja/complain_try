const http = require('http');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'phpdb',
  password: 'phpdb',
  database: 'complaint_management',
  charset: 'utf8'
});

//html string that will be send to browser
var reo ='<html><head><title>Node.js MySQL Select</title></head><body><h1>Node.js MySQL Select</h1>{${table}}</body></html>';

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
function setResHtml(sql, cb){
  pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].user_id_by +'</td><td>'+ '<td>' + res[i].cc_id + '</td>'+ 
        '<td>' + res[i].c_description + '</td>' + '<td>' + res[i].complaint_date + '</td>' + '<td>' + res[i].complaint_allotment_date + '</td>'
        '<td>' + res[i].complaint_completed_date + '</td>'+ '<td>' + res[i].complaint_status + '</td>'+ '<td>' + res[i].deleted + '</td>' 
        +'<td>' + res[i].user_id_alloted_to + '</td></tr>' ;
      }
      table ='<table border="1"><tr><th>Sr. No.</th><th>User ID</th><th>Caterogy ID</th><th>Description</th><th>Complain Date</th><th>COmplain Allotment Date</th><th>Complain Completetion Date</th><th>Status</th><th>Deleted</th><th>Alloted To</th></tr>'+ table +'</table>';

      con.release(); //Done with mysql connection

      return cb(table);
    });
  });
}

let sql ='SELECT * FROM complaints';

//create the server for browser access
const server = http.createServer((req, res)=>{
  setResHtml(sql, resql=>{
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo, 'utf-8');
    res.end();
  });
});

server.listen(8080, ()=>{
  console.log('Server running at //localhost:8080/');
});