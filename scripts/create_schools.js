#!/usr/bin/env node

var parse = require('csv-parse');
var request = require('request');

var RCD_CODE_COLUMN_INDEX = 0;
var TYPE_CODE_COLUMN_INDEX = 1;
var SCHOOL_CODE_COLUMN_INDEX = 2;
var FACILITY_NAME_COLUMN_INDEX = 3;
var ADDRESS_COLUMN_INDEX = 4;
var CITY_COLUMN_INDEX = 5;
var ZIP_COLUMN_INDEX = 6;
var GRADE_SERVED_COLUMN_INDEX = 7;

var LC_API_URL = process.env.LC_API_URL || 'http://localhost:3000/api/1'; 
var SCHOOLS_ENDPOINT = LC_API_URL + '/schools';

var getRCDTSCode = function(row) {
  return row[RCD_CODE_COLUMN_INDEX] + row[TYPE_CODE_COLUMN_INDEX] + row[SCHOOL_CODE_COLUMN_INDEX];
};

var getSchoolRecord = function(row, columnNames) {
  var schoolProps = columnNames.reduce(function(school, columnName, i) {
    if (i != RCD_CODE_COLUMN_INDEX && i != TYPE_CODE_COLUMN_INDEX && i != SCHOOL_CODE_COLUMN_INDEX) {
      school[columnName] = row[i];
    }
    return school;
  }, {});

  schoolProps.rcdts = getRCDTSCode(row);

  return schoolProps;
};


var reader = parse();
process.stdin.pipe(reader);

var columnNames;
var i = 0;

// First, clear out the old schools
request({
  url: SCHOOLS_ENDPOINT,
  method: 'DELETE',
}, function (error, response, body) {
  reader.on('readable', function() {
    var row;
    var schools = [];

    while(row = reader.read()) {
      if (i == 0) {
        columnNames = row.slice();  
        continue;
      } 

      schools.push(getSchoolRecord(row, columnNames));

      // Create batches of 20 schools, otherwise the requests get too big
      if (schools.length == 20) {
        request({
          url: SCHOOLS_ENDPOINT,
          method: 'POST',
          json: schools
        });
        schools = []; 
      }

      i += 1;
    }

    // If there are any other schools left, add them too
    if (schools.length) {
      request({
        url: SCHOOLS_ENDPOINT,
        method: 'POST',
        json: schools
      });
    }
  });
});
