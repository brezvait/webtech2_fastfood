var http = require("http");
var url = require("url");
var express= require("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
var nodeGeocoder = require("node-geocoder");

app.use(bodyParser.urlencoded( {extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get('/', function (req, res) {
	var result = "Hello ";
	console.log(req.query);
   //res.send('Hello ' + req.param('name'));
   if(req.query['name'] != undefined) {
     result += req.query['name'];
   }
   else {
     result += "World";
   }
   res.send(result);
 })

app.get('/getRestaurants', function(req,res) {
	fs.readFile(__dirname+"/restaurants.json", "UTF8", function(err,data) {
		res.send(data);
	});
})
app.get('/getRestaurants/:id', function(req,res) {
    var restaurants = JSON.parse(fs.readFileSync(__dirname+"/restaurants.json", "UTF8"));
    restaurants = restaurants.filter(function(restaurant) { return restaurant.id == req.params.id })
    res.send(JSON.stringify(restaurants));
})
app.post('/addRestaurant', function(req,res) {
		var restaurants = JSON.parse(fs.readFileSync(__dirname+"/restaurants.json", "UTF8"));
    var last = 0;
    for(var i = 0; i < restaurants.length; i++) {
      if(restaurants[i].id > last) {
        last = restaurants[i].id;
      }
    }
    req.body.id = last + 1;
		restaurants.push(req.body);
		fs.writeFile(__dirname+"/restaurants.json", JSON.stringify(restaurants), function(err) {
			res.send(JSON.stringify(restaurants));
   })
  
})

app.delete('/delRestaurant/:id', function(req,res) {
  var restaurants = JSON.parse(fs.readFileSync(__dirname+"/restaurants.json", "UTF8"));
  restaurants = restaurants.filter(function(restaurant) { return restaurant.id != req.params.id })
  fs.writeFile(__dirname+"/restaurants.json", JSON.stringify(restaurants), function(err) {
    res.send(JSON.stringify(restaurants));
  })
  
})

app.put('/modRestaurant/:id', function(req,res) {
  var restaurants = JSON.parse(fs.readFileSync(__dirname+"/restaurants.json", "UTF8"));

  //restaurantmod = restaurants.filter(function(restaurant) { return restaurant.id == req.params.id })
  fs.writeFile(__dirname+"/restaurants.json", JSON.stringify(restaurants), function(err) {
      res.send(JSON.stringify(restaurants));
   })
})

var server = app.listen(8081, function () {
 var host = server.address().address
 var port = server.address().port

 console.log("Restaurant app listening at http://%s:%s", host, port)
})