#!/usr/bin/env node

var parse = require('csv-parse');

var RCD_CODE_COLUMN_INDEX = 0;
var TYPE_CODE_COLUMN_INDEX = 1;
var SCHOOL_CODE_COLUMN_INDEX = 2;
var FACILITY_NAME_COLUMN_INDEX = 3;
var ADDRESS_COLUMN_INDEX = 4;
var CITY_COLUMN_INDEX = 5;
var ZIP_COLUMN_INDEX = 6;
var GRADE_SERVED_COLUMN_INDEX = 7;

var getRCDTSCode = function(row) {
  return row[RCD_CODE_COLUMN_INDEX] + row[TYPE_CODE_COLUMN_INDEX] + row[SCHOOL_CODE_COLUMN_INDEX];
};

var getSchoolFeature = function(row, columnNames) {
  var schoolProps = columnNames.reduce(function(school, columnName, i) {
    if (i != RCD_CODE_COLUMN_INDEX && i != TYPE_CODE_COLUMN_INDEX && i != SCHOOL_CODE_COLUMN_INDEX) {
      school[columnName] = row[i];
    }
    return school;
  }, {});

  schoolProps.RCDTS = getRCDTSCode(row);
  var coordinates = [parseFloat(schoolProps.lng), parseFloat(schoolProps.lat)];
  delete schoolProps.lng;
  delete schoolProps.lat;
  return {
    type: 'Feature',
    id: schoolProps.RCDTS,
    geometry: {
      type: 'Point',
      coordinates: coordinates
    },
    properties: schoolProps
  };
};

var reader = parse();
process.stdin.pipe(reader);

var columnNames;
var i = 0;
var schools = {
  type: 'FeatureCollection',
  features: []
};

reader.on('readable', function() {
  var row;
  var school;

  while(row = reader.read()) {
    if (i == 0) {
      columnNames = row.slice();  
    } 
    else {
      schools.features.push(getSchoolFeature(row, columnNames));
    }
    i += 1;
  }
});

reader.on('end', function() {
  console.log(JSON.stringify(schools));
});


