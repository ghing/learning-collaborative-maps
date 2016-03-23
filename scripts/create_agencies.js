#!/usr/bin/env node

var parse = require('csv-parse');
var request = require('request');

var LC_API_URL = process.env.LC_API_URL || 'http://localhost:3000/api/1'; 
var AGENCIES_ENDPOINT = LC_API_URL + '/agencies';

function slugify(s, replacement) {
  return s.replace(/[\'’]/g, '').replace(/[ \/]+/g, replacement).toLowerCase();
}

function createAgency(row) {
  return Object.keys(row).reduce(function(agency, prop) {
    var cleanProp = slugify(prop, '_');
    if (prop == 'lat' || prop == 'lng') {
      if (row[prop]) {
        agency[cleanProp] = parseFloat(row[prop]);
      }
      else {
        agency[cleanProp] = null;
      }
    }
    else {
      agency[cleanProp] = row[prop];
    }
    if (cleanProp == 'agency') {
      agency.slug = slugify(row[prop], '-');
    } 
    return agency;  
  }, {});
}

var reader = parse({
  columns: true
});
process.stdin.pipe(reader);

request({
  url: AGENCIES_ENDPOINT,
  method: 'DELETE'
}, function(error, response, body) {
  reader.on('readable', function() {
    var row
    var agencies = [];

    while (row = reader.read()) {
      agencies.push(createAgency(row));
    }

    request({
      url: AGENCIES_ENDPOINT,
      method: 'POST',
      json: agencies
    });
  });
});

