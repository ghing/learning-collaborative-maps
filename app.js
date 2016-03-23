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

function featureGeoJson(feature) {
  var coordinates = [feature.lng, feature.lat];
  var props = Object.keys(feature).reduce(function(props, prop) {
    if (prop != 'lat' && prop != 'lng') {
      props[prop] = feature[prop]; 
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

function geoJsonCollection(features) {
  return {
    type: "FeatureCollection",
    features: features.map(featureGeoJson)
  };
}

function createAgencies(agencies, db, callback) {
  var collection = db.collection('agencies');
  collection.insertMany(agencies, function(err, result) {
    console.log("Created " + result.insertedCount + " agencies");
    callback(result);
  });
}

function deleteAgencies(condition, db, callback) {
  db.collection('agencies').deleteMany(condition, function(err, results) {
    console.log("Deleted agencies");
    callback();
  });
}

function getAgencies(condition, db, callback) {
  var collection = db.collection('agencies');

  collection.find({}).toArray(function(err, docs) {
    console.log("Retrieved " + docs.length + " agencies");
    callback(docs);
  });
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

app.get('/api/1/agencies', function(req, res) {
  var format = req.query.format || 'json';
  getAgencies({}, dbConnection, function(agencies) {
    if (format == 'geojson') {
      res.json(geoJsonCollection(agencies));
    }
    else {
      res.json(agencies);
    }
  });
});

app.post('/api/1/agencies', function(req, res) {
  var agencies = req.body;
  if (!agencies.length) {
    agencies = [agencies]; 
  }
  createAgencies(agencies, dbConnection, function() {
    res.json(agencies);
  });
});

app.delete('/api/1/agencies', function(req, res) {
  deleteAgencies({}, dbConnection, function() {
    res.json();
  });
});

app.get('/api/1/schools', function(req, res) {
  var format = req.query.format || 'json';
  getSchools({}, dbConnection, function(schools) {
    if (format == 'geojson') {
      res.json(geoJsonCollection(schools));
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
  });
});

MongoClient.connect(DATABASE_URL, function(err, db) {
  dbConnection = db;
  app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  });
});
