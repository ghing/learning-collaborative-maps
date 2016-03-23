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

function fixProgramAgency(agencyLookup, program) {
  var agency = agencyLookup[program.agency];

  program.agency = '/api/1/agencies/' + agency.slug;

  return program; 
}

function fixSchoolProgramAgencies(agencyLookup, school) {
  if (!school.programs) {
    return school;
  }

  school.programs = school.programs.map(fixProgramAgency.bind(undefined, agencyLookup));
  return school;
}

function getSchools(condition, db, callback) {
  db.collection('schools').find(condition).toArray(function(err, docs) {
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

function deleteSchoolPrograms(school, db, callback) {
  var collection = db.collection('schools');
  collection.updateOne(
    {
      'rcdts': school.rcdts
    },
    {
      $set: {
        'programs': []
      }
    },
    function(err, results) {
      callback();
    }
  );
}

function addSchoolProgram(school, program, db, callback) {
  db.collection('schools').updateOne(
    {
      rcdts: school.rcdts
    },
    {
      $push: {
        programs: program
      }
    },
    function(err, results) {
      callback();
    }
  );
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

app.param('agencySlug', function(req, res, next, agencySlug) {
  getAgencies({slug: agencySlug}, dbConnection, function(agencies) {
    req.agency = agencies[0];
    next();
  });
});

app.get('/api/1/agencies/:agencySlug', function(req, res) {
  res.json(req.agency);
});


app.get('/api/1/schools', function(req, res) {
  var format = req.query.format || 'json';

  getAgencies({}, dbConnection, function(agencies) {
    var agencyLookup = agencies.reduce(function(lookup, agency) {
      lookup[agency._id] = agency;
      return lookup;
    }, {});

    getSchools({}, dbConnection, function(schools) {
      schools = schools.map(fixSchoolProgramAgencies.bind(undefined, agencyLookup));

      if (format == 'geojson') {
        res.json(geoJsonCollection(schools));
      }
      else {
        res.json(schools);
      }
    });
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

app.param('rcdts', function(req, res, next, rcdts) {
  getSchools({rcdts: rcdts}, dbConnection, function(schools) {
    req.school = schools[0];
    next();
  });
});

app.get('/api/1/schools/:rcdts', function(req, res) {
  res.json(req.school);
});

app.delete('/api/1/schools/:rcdts/programs', function(req, res) {
  deleteSchoolPrograms(req.school, dbConnection, function() {
    res.json();
  });
});

app.post('/api/1/schools/:rcdts/programs', function(req, res) {
  var program = req.body;
  var agencyUrlBits = program.agency.split('/');
  var agencySlug = agencyUrlBits[agencyUrlBits.length - 1];
  getAgencies({'slug': agencySlug}, dbConnection, function(agencies) {
    var agency = agencies[0];
    var programProps = {
      agency: agency._id,
      age_group: program.age_group
    }
    addSchoolProgram(req.school, programProps, dbConnection, function() {
      res.json();
    })
  });
});


MongoClient.connect(DATABASE_URL, function(err, db) {
  dbConnection = db;
  app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  });
});
