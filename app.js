var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
var React = require('react');
var renderToString = require('react-dom/server').renderToString;
var reactRouter = require('react-router');
var match = reactRouter.match;
var RouterContext = reactRouter.RouterContext;
var routes = require('./dist/routes');

var middleware = require('./middleware');

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

// Agencies

app.get('/api/1/agencies', middleware.getAgencies);

app.post('/api/1/agencies', middleware.createAgency);

app.delete('/api/1/agencies', middleware.deleteAgency);

app.param('agencySlug', middleware.setAgencySlug);

app.get('/api/1/agencies/:agencySlug', middleware.getAgency);


// Schools

app.get('/api/1/schools', middleware.getSchools);

app.post('/api/1/schools', middleware.createSchool);

app.delete('/api/1/schools', middleware.deleteSchool);

app.param('rcdts', middleware.setRcdts);

app.get('/api/1/schools/:rcdts', middleware.getSchool);


// Programs

app.delete('/api/1/schools/:rcdts/programs', middleware.deleteAllSchoolPrograms);

app.post('/api/1/schools/:rcdts/programs', middleware.createProgram);

app.get('/api/1/programs', middleware.getPrograms);

app.delete('/api/1/programs', middleware.deleteAllPrograms);

app.param('programId', middleware.setProgramId);

app.put('/api/1/schools/:rcdts/programs/:programId', middleware.updateProgram);

app.post('/api/1/schools/:rcdts/programs/:programId/notes', middleware.createProgramNote);

app.put('/api/1/schools/:rcdts/programs/:programId/notes/:noteId', middleware.updateProgramNote);

// Non-API routes
//
// These will be handled by React Router
// This needs to be defined last so that API routes don't get handled by
// the router.

// This is based on the pattern described at
// https://github.com/reactjs/react-router-tutorial/tree/master/lessons/13-server-rendering
// Send all requests to index.html so browserHistory works
app.get('*', function (req, res) {
  // Match the routes to the url
  match({ routes: routes, location: req.url }, function(err, redirect, props) {
    // `RouterContext` is what the `Router` renders. `Router` keeps these
    // `props` in its state as it listens to `browserHistory`. But on the
    // server our app is stateless, so we need to use `match` to
    // get these props before rendering.

    if (err) {
      // There was an error somewhere during route matching
      res.status(500).send(err.message)
    }
    else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    }
    else {
      // If we got props then we matched a route and can render
      var appHtml = renderToString(React.createElement(RouterContext, props, null));
      // Dump the HTML into a template
      res.render('index', {appHtml: appHtml});

      // TODO: Handle 404
    }
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
