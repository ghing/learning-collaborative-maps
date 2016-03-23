var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;

var DATABASE_URL = process.env.LC_DATABASE_URL;


function createSchools(schools, db, callback) {
  var collection = db.collection('schools');
  collection.insertMany(schools, function(err, result) {
    console.log("Created " + result.insertedCount + " schools");
    callback(result);
  });
}

function getSchools(condition, db, callback) {
  var collection = db.collection('schools');

  collection.find({}).toArray(function(err, docs) {
    console.log("Retrieved " + docs.length + " schools");
    callback(docs);
  });
}

function deleteSchools(condition, db, callback) {
  db.collection('schools').deleteMany(condition, function(err, results) {
     console.log("Deleted schools");
     callback();
  });
}

function schoolGeoJson(school) {
  var coordinates = [school.lng, school.lat];
  var props = Object.keys(school).reduce(function(props, prop) {
    if (prop != 'lat' && prop != 'lng') {
      props[prop] = school[prop]; 
    }
    return props;
  }, {});
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coordinates
    },
    properties: props
  };
}

function schoolsGeoJson(schools) {
  return {
    type: "FeatureCollection",
    features: schools.map(schoolGeoJson)
  };
}

var app = express();
var dbConnection;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/api/1/schools', function(req, res) {
  var format = req.query.format || 'json';
  getSchools({}, dbConnection, function(schools) {
    if (format == 'geojson') {
      res.json(schoolsGeoJson(schools));
    }
    else {
      res.json(schools);
    }
  });
});

app.post('/api/1/schools', function(req, res) {
  var schools = req.body;
  if (!schools.length) {
    schools = [schools]; 
  }
  createSchools(schools, dbConnection, function() {
    res.json(schools);
  });
});

app.delete('/api/1/schools', function(req, res) {
  deleteSchools({}, dbConnection, function() {
    res.json();
  })
});

MongoClient.connect(DATABASE_URL, function(err, db) {
  dbConnection = db;
  app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  });
});
