var express = require('express');
var app = express();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var _ = require('underscore');
var db = require('./model/db.js');

var myDb = mongoose.connect('mongodb://localhost:27017/codeChallenge2');

app.use(express.static(__dirname + '/public'));

app.listen('8080', function() {
    console.log('I am listening on port 8080');
});

app.use(bodyParser.json());
app.use(cors());

//creating new employee model in the collection
app.post('/employee',function(req, resp){
    var temp = req.body;
    var emp = new db({_id: temp._id, fName: temp.fName,
       lName: temp.lName, mName: temp.mName});

    emp.save(function(err) {
        if (err){
            resp.status(404).send({"error":err});
        } else {
            resp.status(200).send(emp);
        }

    });
});

//Getting all the employees in the database
app.get("/employees", function(req, resp){

    db.find(function(err, data){
        if(err){
            resp.status(500).send();
        } else {
            resp.status(200).send(data);
        }
    });

});

//Getting employee by employeeid
app.get("/employee/:id", function(req, resp){

    db.find({_id: req.params.id}, function(err, data){
        if(err){
            resp.status(500).send();
        } else if (data.length === 0){
            resp.status(404).send({error: "No employee with the given id."});
        } else {
            resp.status(200).send(data);
        }
    });

});

//updating employee model by employeeid
app.put('/employee/:id', function (req, resp) {

    if(!_.isEmpty(req.body)) {

      var condition = { _id: req.params.id};
      var update = req.body;
      var options = {multi: true};

      db.update(condition, update, options, function(err, data) {
          if(err){
              resp.status(500).send();
          } else {
              resp.status(200).send(data);
          }
      });

    } else {
       resp.status(500).send();
    }

});

//Deleting the employee model by id
app.delete('/employee/:id', function (req, resp) {

	db.remove({_id: req.params.id}, function(err, data){

      if(err){
          resp.status(500).send();
      } else if(data.result.n === 0){
          resp.status(404).send({error: "No employee with the given id."});
      } else {
          resp.status(200).send(data);
      }

	});

});
