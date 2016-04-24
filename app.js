var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;

var routes = require('./routes');

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

// Make database connection available as a property of the request object
// for all requests.  This will make it easier to decouple the handlers from
// Express and therefore easier to test
app.all('*', function(req, response, next) {
    req.dbConnection = dbConnection;
    next();
});

app.get('/', function (req, res) {
    res.render('index');
});

// Agencies
//
app.get('/api/1/agencies', routes.getAgencies);

app.post('/api/1/agencies', routes.createAgency);

app.delete('/api/1/agencies', routes.deleteAgency);

app.param('agencySlug', routes.setAgencySlug);

app.get('/api/1/agencies/:agencySlug', routes.getAgency);


// Schools

app.get('/api/1/schools', routes.getSchools);

app.post('/api/1/schools', routes.createSchool);

app.delete('/api/1/schools', routes.deleteSchool);

app.param('rcdts', routes.setRcdts);

app.get('/api/1/schools/:rcdts', routes.getSchool);


// Programs

app.delete('/api/1/schools/:rcdts/programs', routes.deleteAllSchoolPrograms);

app.post('/api/1/schools/:rcdts/programs', routes.createProgram);

app.get('/api/1/programs', routes.getPrograms);

app.delete('/api/1/programs', routes.deleteAllPrograms);

app.param('programId', routes.setProgramId);

app.post('/api/1/schools/:rcdts/programs/:programId/notes', routes.createProgramNote);


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
