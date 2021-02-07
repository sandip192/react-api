/*
* REST API with node JS
*
* Listing      - http://127.0.0.1:8081/
* Specific GET - http://127.0.0.1:8081/:obj_id
* POST         - http://127.0.0.1:8081/add_user 
* DELETE       - http://127.0.0.1:8081/:obj_id
* 
*
*
*/

var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";



// This responds a GET request for the /list_user page.
app.get('', function ( req, res) { 

	MongoClient.connect(url, function(err, db) { 
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  dbo.collection("users").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    db.close();
	    res.send(result);
	  });
	});  
   
});


// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/:obj_id', function(req, res) { 
	//console.log(req.params);
   var o_id = new mongo.ObjectID(req.params.obj_id);  
   MongoClient.connect(url, function(err, db) { 
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  dbo.collection("users").findOne({ _id: o_id }, function(err, result) {
	    if (err) {
	    	res.send('error');
	    }
	    db.close();
	    res.send(result);
	  });
	}); 
});


// This responds a POST request for the homepage
app.post('/add_user', function (req, res) {
   //console.log(req.body);
   MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  var date = new Date();
	  var timestamp = date.getTime();
	  var myobj = { name: req.body.name, email: req.body.email ,created_on: timestamp, last_update: timestamp, user_type: req.body.user_type, is_active: req.body.is_active, is_deleted: false };
	  dbo.collection("users").insertOne(myobj, function(err, result) {
	    if (err) {
	    	res.send('error');
	    }
	    db.close();
	    res.send(result);
	  });
	});
});


// This responds a DELETE request for the /del_user page.
app.delete('/:obj_id', function (req, res) {
   var o_id = new mongo.ObjectID(req.params.obj_id);  
   MongoClient.connect(url, function(err, db) { 
	  if (err) throw err;

	  var myquery = { _id: o_id };
  	  var newvalues = {$set: {is_deleted: true } };

	  var dbo = db.db("mydb");
	  dbo.collection("users").updateOne(myquery, newvalues, function(err, result) {
	    if (err) {
	    	res.send('error');
	    }
	    db.close();
	    res.send('success');
	  });
	}); 
});


var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;   
   console.log("Example app listening at http://%s:%s", host, port);
});





