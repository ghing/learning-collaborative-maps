var bodyParser = require('body-parser');
var express = require('express');
var exphbs  = require('express-handlebars');
var session = require('express-session');
var MongoDBSessionStore = require('connect-mongodb-session')(session);
var MongoClient = require('mongodb').MongoClient;
var React = require('react');
var renderToString = require('react-dom/server').renderToString;
var reactRouter = require('react-router');
var match = reactRouter.match;
var RouterContext = reactRouter.RouterContext;
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

var middleware = require('./middleware');
var routes = require('./dist/routes');
var sendgridTokenDelivery = require('./utils').sendgridTokenDelivery;

var DATABASE_URL = process.env.LC_DATABASE_URL;
var TRANSACTIONAL_EMAIL_ADDRESS = process.env.LC_TRANSACTIONAL_EMAIL_ADDRESS;
var PORT = process.env.PORT || 3000;
var APP_URL = process.env.LC_APP_URL || 'http://localhost:' + PORT;

var app = express();
var store = new MongoDBSessionStore({
  uri: DATABASE_URL,
  collection: 'sessions'
});
var sess = {
  secret: process.env.LC_SESSION_SECRET,
  cookie: {},
  store: store,
  resave: false,
  saveUninitialized: false
};
var dbConnection;

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

passwordless.init(new MongoStore(DATABASE_URL));
passwordless.addDelivery(sendgridTokenDelivery(APP_URL, sg, TRANSACTIONAL_EMAIL_ADDRESS));

app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({ successRedirect: '/'}));

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

// Auth

app.post('/api/1/auth/tokens', middleware.createLoginToken, middleware.sendCreatedUser);

// Non-API routes
//
// These will be handled by React Router
// This needs to be defined last so that API routes don't get handled by
// the router.

// This is based on the pattern described at
// https://github.com/reactjs/react-router-tutorial/tree/master/lessons/13-server-rendering
// Send all requests to index.html so browserHistory works
function routeToReact(req, res) {
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
}

// Separate route here, because we don't want login to be restricted
app.get('/login', routeToReact);

app.get('/logout', passwordless.logout({}), function(req, res) {
  res.redirect('/');
});

app.get('*', passwordless.restricted({ failureRedirect: '/login' }), routeToReact);

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
