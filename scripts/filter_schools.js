#!/usr/bin/env node

var stringify = require('csv-stringify');
var xlsx = require('xlsx');

var SOURCE_WOORKSHEETS = new Set(['Public Dist & Sch', 'Non Pub Sch']);

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

// District RCD codes for non-Cook districts that we want to include
var GLENBARD_DISTRICT_RCD = '190220870';
var HINSDALE_DISTRICT_RCD = '190220860';
var DUPAGE_DISTRICT_RCD = '190220880';
var LARAWAY_DISTRICT_RCD = '56099070C';

// DISTRICT codes non-Cook schools we want to include, including private schools
var NON_COOK_RCD_CODES = new Set([
  GLENBARD_DISTRICT_RCD,
  HINSDALE_DISTRICT_RCD,
  DUPAGE_DISTRICT_RCD,
  LARAWAY_DISTRICT_RCD
]);

var INDEX_TO_LETTER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').reduce(function(lookup, letter, i) {
  lookup[i] = letter;
  return lookup;
}, {});

var filterRow = function(worksheet, i) {
  var cell;

  // Include header row
  if (i == 0) {
    return true;
  }

  // Only include school records
  var recTypeRef = INDEX_TO_LETTER[REC_TYPE_COLUMN_INDEX] + (i + 1);
  cell = worksheet[recTypeRef];
  if (!cell || (cell.v != 'Sch' && cell.v != 'Non Pub Sch')) {
    return false;
  }

  // Include schools with an RCD code in our explicit list
  var rcdCodeRef = INDEX_TO_LETTER[RCD_CODE_COLUMN_INDEX] + (i + 1);
  cell = worksheet[rcdCodeRef];
  if (cell && NON_COOK_RCD_CODES.has(cell.v)) {
    return true;
  }

  // Include all schools in cook county
  var countyNameRef = INDEX_TO_LETTER[COUNTY_NAME_COLUMN_INDEX] + (i + 1);
  cell = worksheet[countyNameRef];
  if (cell && cell.v == 'Cook') {
    return true;
  }

  // Othwerwise, exclude the record
  return false;
};

var inputPath = process.argv[2];

var workbook = xlsx.readFile(inputPath);
var writer = stringify();
writer.pipe(process.stdout);

var sheetNumber = 0;
workbook.SheetNames.forEach(function(sheetName) {
  if (!SOURCE_WOORKSHEETS.has(sheetName)) {
    return;
  }

  var worksheet = workbook.Sheets[sheetName];
  var range = worksheet['!range'];

  for (var i = range.s.r; i < range.e.r; i++) {
    if (!filterRow(worksheet, i)) {
      continue;
    }

    // Only include header rows on first sheet
    if (i == 0 && sheetNumber != 0) {
      continue;
    }

    var row = OUTPUT_COLUMNS.map(function(j) {
      var cellRef = INDEX_TO_LETTER[j] + (i + 1);
      var cell = worksheet[cellRef];
      if (cell) {
        return cell.v;
      }
      else {
        return null;
      } 
    });
    writer.write(row);
  }

  sheetNumber += 1;
});

writer.end();
