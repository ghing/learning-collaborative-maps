#!/usr/bin/env node

var Geocodio = require('geocodio');
var parse = require('csv-parse');
var stringify = require('csv-stringify');

var RCD_CODE_COLUMN_INDEX = 0;
var TYPE_CODE_COLUMN_INDEX = 1;
var SCHOOL_CODE_COLUMN_INDEX = 2;
var FACILITY_NAME_COLUMN_INDEX = 3;
var ADDRESS_COLUMN_INDEX = 4;
var CITY_COLUMN_INDEX = 5;
var ZIP_COLUMN_INDEX = 6;
var GRADE_SERVED_COLUMN_INDEX = 7;

var OUTPUT_COLUMNS = [
  RCD_CODE_COLUMN_INDEX,
  TYPE_CODE_COLUMN_INDEX,
  SCHOOL_CODE_COLUMN_INDEX,
  FACILITY_NAME_COLUMN_INDEX,
  ADDRESS_COLUMN_INDEX,
  CITY_COLUMN_INDEX,
  ZIP_COLUMN_INDEX,
  GRADE_SERVED_COLUMN_INDEX
];

var getGeocodableAddress = function(row) {
  return [
    row[ADDRESS_COLUMN_INDEX],
    row[CITY_COLUMN_INDEX],
    "IL",
    row[ZIP_COLUMN_INDEX].replace(/\s+/, '-')
  ].join(", ");
}

var reader = parse();
process.stdin.pipe(reader);

var writer = stringify();
writer.pipe(process.stdout);

if (!process.env.GEOCODIO_API_KEY) {
  console.error("You must set the GEOCODIO_API_KEY environment variable");
  process.exit(1);
}

var geocodio = new Geocodio({
  api_key: process.env.GEOCODIO_API_KEY
});


var i = 0;
var rows = [];
var addresses = [];
var columnNames;

reader.on('readable', function() {
  var row;

  while(row = reader.read()) {
    if (i == 0) {
      columnNames = row.slice();  
    } 
    else {
      rows.push(row);
      addresses.push(getGeocodableAddress(row));
    }
    i += 1;
  }
});

reader.on('end', function() {
  columnNames.push('lat');
  columnNames.push('lng');
  writer.write(columnNames);

  geocodio.post('geocode', addresses, function(err, response) {
    if (err) throw err;

    response.results.forEach(function(result, i) {
      var row = rows[i];
      var location = result.response.results[0].location;
      row.push(location.lat);
      row.push(location.lng);
      writer.write(row);
    })
  });
});
