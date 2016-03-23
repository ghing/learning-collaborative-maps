Learning Collaborative Maps
===========================

Web map to help coordinate healthy relationships education in the Chicago area.

Assumptions
-----------

* Geocod.io API KEY (just needed to generate schools list)

Generating schools GeoJSON
--------------------------

There is a GeoJSON file of Cook County Schools in `data/schools.json`.  This is generated from the Illinois State Board of Education (ISBE) [Directory of Educational Entities](http://www.isbe.net/research/htmls/directories.htm).

This package includes scripts to download the directory spreadsheet, filter it to required fields, geocode the addresses and generate GeoJSON.

To run this pipeline to regenerate the schools.json file:

    npm run download:educationalentities
    npm run filterschools
    npm run geocodeschools
    npm run schoolsjson


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


Collaborators
-------------

* Geoff Hing <geoffhing@gmail.com> - Development
