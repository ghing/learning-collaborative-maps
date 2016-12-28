eearning Collaborative Maps
===========================

Web map to help coordinate healthy relationships education in the Chicago area.

Assumptions
-----------

* Geocod.io API KEY (just needed to generate schools list)
* MongoDB
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

Deploying the app
-----------------

    git push heroku master

Dumping the production database
-------------------------------

Use the [mongodump](https://docs.mongodb.com/manual/reference/program/mongodump/) command to create a dump of the production database:

    mongodump --host <mlab_database_host> --port <mlab_database_port> --user <mlab_database_user> --db <mlab_database_name> 

You can find the connection parameters from the mLab dashboard that you can access when viewing your app in Heroku's dashboard.

By default `mongodump` stores the dump files in a directory named `dump` in the current working directory.

You can restore dump you created into your local development environment using the [mongorestore](https://docs.mongodb.com/manual/reference/program/mongorestore/) command:

    mongorestore --db learning_collaborative dump/heroku_1ab23c45

In the example above, replace `heroku_1ab23c45` with the subdirectory created when you ran mongodump.


Collaborators
-------------

* Geoff Hing <geoffhing@gmail.com> - Development
