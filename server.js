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
app.get('/getLatLong', function(req,res) {
  if((req.query['name'] == undefined) || (req.query['name'] == null)) {
    res.send("No restaurants found by that name!");
    return;
  }
  else {
    var restaurants = JSON.parse(fs.readFileSync(__dirname+"/restaurants.json", "UTF8"));
    restaurants = restaurants.filter(function(restaurant) { return restaurant.name == req.query['name']})
    res.send(restaurants);
  }
})

app.post('/addRestaurant', function(req,res) {
	/*if((req.query['name'] == undefined) || (req.query['name'] == null)) {
		res.send("You have to define a name for the restaurant!");
		return;
	}
	else {*/
		var restaurants = JSON.parse(fs.readFileSync(__dirname+"/restaurants.json", "UTF8"));
    var last = 0;
    console.log("Hossz: "+restaurants.length);
    for(var i = 0; i < restaurants.length; i++) {
      if(restaurants[i].id > last) {
        last = restaurants[i].id;
        console.log("Forban: "+last);
      }
    }
    console.log(req.body);
    req.body.id = last + 1;
    console.log(JSON.stringify(restaurants));
		restaurants.push(req.body);
		fs.writeFile(__dirname+"/restaurants.json", JSON.stringify(restaurants), function(err) {
			res.send(err);
   })
  
})
app.get('/queryCoord', function(req,res) {
  var options = {
    provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCOum7rLqWUpazwTQslGZnd5d7pbZB2uGg', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = nodeGeocoder(options);
/*geocoder.geocode('29 champs elysée paris', function(err, resp) {
  var result = JSON.parse(resp);
  console.log(result);
})*/




geocoder.geocode('29 champs elysée paris')
  .then(function(resp) {
    //var result = JSON.parse(resp);
    console.log(resp);
  })
  .catch(function(err) {
    console.log(err);
  });
})


/*
http.get(url.parse('http://maps.googleapis.com/maps/api/geocode/json?address=Hungary,+1062,+Budapest,+Vaci+ut,+1-3'), function(res) {
    var data = [];

    res.on('data', function(chunk) {
        data.push(chunk);
    }).on('end', function() {
        //at this point data is an array of Buffers
        //so Buffer.concat() can make us a new Buffer
        //of all of them together
        var buffer = Buffer.concat(data);
        console.log(buffer);
    });
  });*/


/*



	}
	}, (response) => {
		var lat = response.query['results']['geometry']['location']['lat'];
		var long = response.query['results']['geometry']['location']['lng'];
	})
})




/*
http.get('http://nodejs.org/dist/index.json', (res) => {
  const statusCode = res.statusCode;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.log(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => rawData += chunk);
  res.on('end', () => {
    try {
      let parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.log(e.message);
    }
  });
}).on('error', (e) => {
  console.log(`Got error: ${e.message}`);
});
*/




/*
app.get('/employees', function(req,res) {
	fs.readFile(__dirname+"/employees.json", "UTF8", function(err,data) {
		res.send(data);
	});
})

app.post('/addEmployee', function(req,res) {
	var employees = JSON.parse(fs.readFileSync(__dirname+"/employees.json", "UTF8"));
	employees.push(req.body);
	fs.writeFile(__dirname+"/employees.json", JSON.stringify(employees), function(err) {
		res.send(err);
	});
	
})

app.get('/deleteEmployee', function(req,res) {
	if((req.query['name'] == undefined) || (req.query['name'] == null)) {
		res.send("fos");
		return;
	}
	else {
		var employees = JSON.parse(fs.readFileSync(__dirname+"/employees.json", "UTF8"));
		employees=employees.filter(function(employee) { return employee.name != req.query['name']});
		console.log(employees);
		fs.writeFile(__dirname+"/employees.json", JSON.stringify(employees), function(err) {
			if(err != null){
				console.log(err);
			}
			return;
		});
		res.send();
	}
})
*/

var server = app.listen(8081, function () {
 var host = server.address().address
 var port = server.address().port

 console.log("Example app listening at http://%s:%s", host, port)
})