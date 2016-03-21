#!/usr/bin/env node

var stringify = require('csv-stringify');
var xlsx = require('xlsx');

var WORKSHEET_NAME = 'Public Dist & Sch';

var COUNTY_NAME_COLUMN_INDEX = 0;
var REC_TYPE_COLUMN_INDEX = 1;
var RCD_CODE_COLUMN_INDEX = 2;
var TYPE_CODE_COLUMN_INDEX = 3;
var SCHOOL_CODE_COLUMN_INDEX = 4;
var FACILITY_NAME_COLUMN_INDEX = 5;
var ADDRESS_COLUMN_INDEX = 7;
var CITY_COLUMN_INDEX = 8;
var ZIP_COLUMN_INDEX = 9;
var GRADE_SERVED_COLUMN_INDEX = 11;

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

var INDEX_TO_LETTER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').reduce(function(lookup, letter, i) {
  lookup[i] = letter;
  return lookup;
}, {});

var filterRow = function(worksheet, i) {
  if (i == 0) {
    return true;
  }

  var countyNameRef = INDEX_TO_LETTER[COUNTY_NAME_COLUMN_INDEX] + (i + 1);
  var cell = worksheet[countyNameRef];
  if (!cell || cell.v != 'Cook') {
    return false;
  }

  var recTypeRef = INDEX_TO_LETTER[REC_TYPE_COLUMN_INDEX] + (i + 1);
  cell = worksheet[recTypeRef];
  if (!cell || cell.v != 'Sch') {
    return false;
  }

  return true;
};

var inputPath = process.argv[2];

var workbook = xlsx.readFile(inputPath);
var writer = stringify();
writer.pipe(process.stdout);

workbook.SheetNames.forEach(function(sheetName) {
  if (sheetName != WORKSHEET_NAME) {
    return;
  }

  var worksheet = workbook.Sheets[sheetName];
  var range = worksheet['!range'];

  for (var i = range.s.r; i < range.e.r; i++) {
    if (!filterRow(worksheet, i)) {
      continue;
    }

    var row = OUTPUT_COLUMNS.map(function(j) {
      var cellRef = INDEX_TO_LETTER[j] + (i + 1);
      var cell = worksheet[cellRef];
      return cell.v;
    });
    writer.write(row);
  }
});

writer.end();
