Learning Collaborative Maps
===========================

Web map to help coordinate healthy relationships education in the Chicago area.

Assumptions
-----------

* Geocod.io API KEY (just needed to generate schools list)

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

To run this pipeline to load the schools:

    npm run download:educationalentities
    npm run filterschools
    npm run geocodeschools
    npm run createschools 

To load agencies, first export the agency worksheet from the Google Spreadsheet, as CSV:
    
    cat agencies.csv | npm run createagencies

To load programs:

    npm run createprograms

Building front-end assets
-------------------------

    npm run build

Running development server
--------------------------

Start Mongo (assuming you installed it on a Mac, using Homebrew):

    mongod --config /usr/local/etc/mongod.conf

Set the database URL as an environment variable:

   export LC_DATABASE_URL="mongodb://localhost:27017/learning_collaborative"

Run the Express app:

    npm run serve


Provisioning the app
--------------------

I decided to deploy this app using Heroku.

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

Collaborators
-------------

* Geoff Hing <geoffhing@gmail.com> - Development
