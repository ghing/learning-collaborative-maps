Learning Collaborative Maps
===========================

Web map to help coordinate healthy relationships education in the Chicago area.

Assumptions
-----------

* Geocod.io API KEY (just needed to generate schools list)
* MongoDB
* Heroku Command Line Interface (CLI)
* Ubuntu 16.04, though earlier versions of this software were developed on Mac OS X 10.11 El Capitan

Data sources
------------

### Schools

The schools on the map are generated from the [Directory of Educational Entities](http://www.isbe.net/research/htmls/directories.htm) from Illinois State Board of Education (ISBE).

### Agencies

The agencies were exported from [a Google Spreadsheet](https://docs.google.com/spreadsheets/d/1_DRDNFkjbnRXOj2UgEEi108coHNcSki8JAZTDeuXHvc/edit) populated by Matt Walsh.

### Programs

The programs were exported from [a Google Spreadsheet](https://docs.google.com/spreadsheets/d/1_DRDNFkjbnRXOj2UgEEi108coHNcSki8JAZTDeuXHvc/edit) populated by Matt Walsh.

Data pipeline
-------------

This package includes scripts to download the directory spreadsheet, filter it to required fields, geocode the addresses and load the information into a database.

To run this pipeline to prepare the school data:

    npm run download:educationalentities
    npm run filterschools
    npm run geocodeschools

To load the schools and other data, you will need to have a running instance of the app, either on your local machine, or deployed somewhere.  See below for instructions on deployment or running the development server.  Then set the `LC_API_URL` accordingly.  For example, if running locally:

    export LC_API_URL="http://localhost:3000/api/1"

Then run the npm script to create the schools:

    npm run createschools

To load agencies, first export the agency worksheet from the Google Spreadsheet, as CSV:

    cat agencies.csv | npm run createagencies

To load programs:

    cat data/programs.json | npm run createprograms

### Known issues

Since Heroku puts the service to sleep when it's not being accessed, you may need to load the production site in your browser before running management commands that load data to production.

Installation
------------

To install this software for local development, follow these steps.

Clone the git repo:

    git clone https://github.com/ghing/learning-collaborative-maps.git

Install front-end build dependencies:

    npm install

Connect your local repo to the production Heroku app:

    heroku git:remote -a learning-collaborative-maps -r production

Connect your local repo to the staging Heroku app:

    heroku git:remote -a lc-maps-staging -r staging

Building front-end assets
-------------------------

    npm run build

Running development server
--------------------------

Start Mongo (assuming you installed it on a Mac, using Homebrew):

    mongod --config /usr/local/etc/mongod.conf

On Ubuntu, run:

    sudo service mongod start

Set the database URL as an environment variable:

   export LC_DATABASE_URL="mongodb://localhost:27017/learning_collaborative"

Run the Express app:

    npm run serve

Configuration
-------------

Configuration is handled through environment variables.

### LC_DATABASE_URL

URL of the MongoDB database where data for this app will be stored.

Example:

    export LC_DATABASE_URL="mongodb://localhost:27017/learning_collaborative"

### LC_API_URL

URL of a running instance of the application.  This will be used by data loading scripts to use the REST API to delete and create objects in the database.

Example:

    export LC_API_URL="http://localhost:3000/api/1"

### SENDGRID_API_KEY

API key generated for the [Sendgrid](https://sendgrid.com/) service.

This is needed to send e-mail for token-based authentication.

### LC_APP_URL

The root URL of this instance of the app.  This is needed to properly construct authentication URLs for the token-based authentication.

Example:

    export LC_APP_URL="http://localhost:300"

### LC_TRANSACTONAL_EMAIL_ADDRESS

Address that will appear as the sender for any transactional emails sent from this app.

Example:

    export LC_TRANSACTONAL_EMAIL_ADDRESS="no-reply@example.com"

### LC_SESSION_SECRET

Secret phrase used to encrypt session keys.

Example:

    export LC_SESSION_SECRET="keyboard cat"


Provisioning the app
--------------------

I decided to deploy this app using Heroku and the [mLab](https://www.mlab.com/) add-on which provides a MongoDB database.

Based on [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

This is based on [Deploying Node.js Apps on Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)

    heroku login
    heroku create learning-collaborative-maps
    heroku addons:create mongolab:sandbox

Log into Heroku and go to the panel for mLab and add a new database user.

Then set the `LC_DATABASE_URL` configuration variable:

    heroku config:set LC_DATABASE_URL="mongodb://learningcollaborative:<your_password_here>@ds015869.mlab.com:15869/heroku_7md41k60"

Set the `NPM_CONFIG_PRODUCTION` environment variable so that the `devDependencies` in `package.json` are installed.  We need these to build our static assets in the `postinstall` script:

    heroku config:set NPM_CONFIG_PRODUCTION=false

TODO: Document setting environment variables in Heroku for token-based authentication.  Until then, you can probably figure it out by looking at the variables in the configuration section and the `heroku config:set` examples above.

Deploying the app
-----------------

To deploy to staging:

    git push staging master

To deploy to production:

    git push production master

Dumping the production database
-------------------------------

Use the [mongodump](https://docs.mongodb.com/manual/reference/program/mongodump/) command to create a dump of the production database:

    mongodump --host <mlab_database_host> --port <mlab_database_port> --username <mlab_database_user> --db <mlab_database_name>

You can find the connection parameters from the mLab dashboard that you can access when viewing your app in Heroku's dashboard.

By default `mongodump` stores the dump files in a directory named `dump` in the current working directory.

You can restore the dump you created into your local development environment using the [mongorestore](https://docs.mongodb.com/manual/reference/program/mongorestore/) command:

    mongorestore --db learning_collaborative dump/heroku_1ab23c45

In the example above, replace `heroku_1ab23c45` with the subdirectory created when you ran mongodump.

You can restore the dump you created to the staging environment using `mongorestore` as well.

Tests
-----

Unit tests for this app are implemented using the [Jest](https://facebook.github.io/jest/) testing framework.

To run all tests, you can simply run:

    npm test

To run tests in a particular suite, you can run:

    ./node_modules/.bin/jest __tests__/LearningCollaborativeApi-test.js

where the argument to the `jest` command is the file containin the test suite.

Application flow
----------------

This section describes how execution and data moves through the application.  This application uses the [Flux](https://facebook.github.io/flux/) architecture.

I'm abivalent about Flux, but it's one way to have a coherant way that data flows through the application:

![Flux diagram](https://facebook.github.io/flux/img/flux-simple-f8-diagram-explained-1300w.png "Flux diagram")

### Agency creation, reading, updating and deletion (CRUD)

Note that School CRUD will be very similar to this.

#### The initial agencies JSON is fetched from the REST API

In the `MapApp` constructor, defined in `learningcollaborative.js`, `LearningCollaborativeApi.agencies()` is called to fetch agencies from the REST API.

`LearningCollaborativeActions.setAgencies()` is used as the callback for the promise returned by `LearningCollaborativeApi.agencies()`.

#### The `setAgencies()` action creator tells the dispatcher to deal with the agencies

`LearningCollaborativeActions.setAgencies()` creates an action of `AGENCIES_SET` and an argument of the array of agency objects from the REST API.

#### AgencyStore handles the `AGENCIES_SET` action

In `AgencyStore.dispatcherIndex()`, a number of action handlers are registered for different action types, including `AGENCES_SET`.

The code that handles the `AGENCIES_SET` action assigns the array of agency objects from the REST API to a private variable and builds some convenience lookup tables and scales from data in the agency objects.

Finally, it emits a `change` event to any components that are listening for that event on the store.

#### Components update their internal state with the new agenices

Both the `AgenciesAdmin` and `LearningCollaborativeMap` components listen for the `change` event emitted by `AgencyStore` (they subscribe via `AgencyStore.addChangeListener()`).  In `AgencyAdmin`'s event handler for the change event, it sets a state variable for the list of all agencies.

#### User visits /admin/agencies

This causes the `AgenciesAdmin` component to be rendered based on the route configuration in `routes.js`.  The route configuration is used when instantiating a `Router` component in `learningcollaborative.js`.

The `AgencyAdmin` component renders a list of agencies using the state variable containing the agency objects retrieved from `AgencyStore`.

#### User visits /admin/agencies/:slug

This causes the `AgenciesAdminForm` to be rendered as a child component of `AgenciesAdmin` based on the route configuration.

The router component also passes a `params` prop to the components that are rendered.  In this case, it sets `params.slug` to the agency slug in the URL.

`AgencyAdmin` then uses `params.slug` to retrieve the agency matching the slug from `AgencyStore` and set the `agency` prop passed to `AgenciesAdminForm`.

Also `AgencyAdmin` sets `handleCreate` and `handleUpdate` props which are passed to `AgencyAdminForm`.  The values of these props are just the `createAgency()` and `updateAgency()` action creators.

#### The user submits `AgenciesAdminForm`

The `<form>` element rendered by `AgenciesAdminForm` is wired up to the `AgenciesAdminForm.handleSubmit()` method.  This method calls through to the value of the `handleUpdate`.  Again, this is actually the `updateAgency()` action creator.

#### The `updateAgency()` action creator hits the REST API

The `updateAgency()` action creator hits the REST API via `LearningCollaborativeApi.createAgency()`.  The callback for the promise returned by that method calls the `LearningCollaborativeServerActions.receiveAgency()` action creator.

#### The `receiveAgency()` action creator creates a `RECEIVE_AGENCY` action

The `receiveAgency()` action creator creates a `RECEIVE_AGENCY` action via the dispatcher.

#### `AgencyStore` handles the `RECEIVE_AGENCY` action

`AgencyStore` handles the `RECEIVE_AGENCY` action.  It updates the agency object, which now reflects the changes persisted via the REST API, in the private array of agency objects initialized when handling the `AGENCIES_SET` action as well as the derived lookup tables.

Finally, `AgencyStore` emits a `change` event to any listeners that were registered via `AgencyStore.addChangeListener()`.

#### `AgenciesAdmin` handles the change event and redirects to `/admin/agencies`

`AgenciesAdmin` handles the change event from the store.  It updates its local state variable of the array of agencies and redirects the user to the list of all agencies at `/admin/agencies` by calling `this.props.router.push()`.

Collaborators
-------------

* Geoff Hing <geoffhing@gmail.com> - Development
