var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;

var dbApi = require('./db-api');

var DATABASE_URL = process.env.LC_DATABASE_URL;
var PORT = process.env.PORT || 3000;

var app = express();
var dbConnection;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// TODO: Handle errors, return error response.
// TODO: Figure out REST semantics for bulk create or just get rid of bulk
// create.
// TODO: Set location header for creates

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/api/1/agencies', function(req, res) {
  var format = req.query.format || 'json';
  dbApi.getAgencies({}, dbConnection, function(agencies) {
    if (format == 'geojson') {
      res.json(dbApi.geoJsonCollection(agencies));
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
  dbApi.createAgencies(agencies, dbConnection, function() {
    res.status(201).json(agencies);
  });
});

app.delete('/api/1/agencies', function(req, res) {
  dbApi.deleteAgencies({}, dbConnection, function() {
    res.json();
  });
});

app.param('agencySlug', function(req, res, next, agencySlug) {
  dbApi.getAgencies({slug: agencySlug}, dbConnection, function(agencies) {
    req.agency = agencies[0];
    next();
  });
});

app.get('/api/1/agencies/:agencySlug', function(req, res) {
  res.json(req.agency);
});


app.get('/api/1/schools', function(req, res) {
  var format = req.query.format || 'json';

  dbApi.getAgencies({}, dbConnection, function(agencies) {
    var agencyLookup = agencies.reduce(function(lookup, agency) {
      lookup[agency._id] = agency;
      return lookup;
    }, {});

    dbApi.getSchools({}, dbConnection, function(schools) {
      schools = schools.map(dbApi.fixSchoolProgramAgencies.bind(undefined, agencyLookup));

      if (format == 'geojson') {
        res.json(dbApi.geoJsonCollection(schools));
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
  dbApi.createSchools(schools, dbConnection, function() {
    res.status(201).json(schools);
  });
});

app.delete('/api/1/schools', function(req, res) {
  dbApi.deleteSchools({}, dbConnection, function() {
    res.json();
  });
});

app.param('rcdts', function(req, res, next, rcdts) {
  dbApi.getSchools({rcdts: rcdts}, dbConnection, function(schools) {
    req.school = schools[0];
    next();
  });
});

app.get('/api/1/schools/:rcdts', function(req, res) {
  res.json(req.school);
});

app.delete('/api/1/schools/:rcdts/programs', function(req, res) {
  dbApi.deleteSchoolPrograms(req.school, dbConnection, function() {
    res.json();
  });
});

app.post('/api/1/schools/:rcdts/programs', function(req, res) {
  var program = req.body;
  var agencyUrlBits = program.agency.split('/');
  var agencySlug = agencyUrlBits[agencyUrlBits.length - 1];
  dbApi.getAgencies({'slug': agencySlug}, dbConnection, function(agencies) {
    var agency = agencies[0];
    var programProps = {
      agency: agency._id,
      age_group: program.age_group,
      program_type: program.program_type
    };
    dbApi.addSchoolProgram(req.school, programProps, dbConnection, function() {
      res.status(201).json(program);
    })
  });
});


MongoClient.connect(DATABASE_URL, function(err, db) {
  if (err) {
    console.error("Could not connect to database. Exiting.");
    process.exit(1);
  }
  dbConnection = db;
  app.listen(PORT, function() {
    console.log('Example app listening on port ' + PORT + '!');
  });
});
