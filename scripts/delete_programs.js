#!/usr/bin/env node

var request = require('request');

var LC_API_URL = process.env.LC_API_URL || 'http://localhost:3000/api/1'; 
var PROGRAMS_ENDPOINT = LC_API_URL + '/programs';

request({
  url: PROGRAMS_ENDPOINT,
  method: 'DELETE'

}, function(error, response) {

});
