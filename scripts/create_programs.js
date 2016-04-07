#!/usr/bin/env node

var async = require('async');
var request = require('request');

var LC_API_URL = process.env.LC_API_URL || 'http://localhost:3000/api/1';
var SCHOOLS_ENDPOINT = LC_API_URL + '/schools';

function stripApiPrefix(path) {
  var bits = path.split('/');
  return '/' + bits.slice(bits.indexOf('schools')).join('/');
}

function createPrograms(programs) {
  var programSchools = programs.reduce(function(schools, program) {
    schools.add(program.school);
    return schools;
  }, new Set());

  async.forEach(programSchools, function(school, callback) {
    request({
      url: LC_API_URL + stripApiPrefix(school) + '/programs',
      method: 'DELETE'
    }, function(error, response) {
      callback();
    });
  }, function(err) {
    programs.forEach(function(program) {
      var programProps = Object.assign({}, program);
      delete programProps.school;
      request({
        url: LC_API_URL + stripApiPrefix(program.school) + '/programs',
        method: 'POST',
        json: programProps
      }, function(error, response) {
      });
    });
  });
}

// Read program JSON from stdin
var programs;
var inputChunks = [];

process.stdin.on('data', function(chunk) {
  inputChunks.push(chunk);
});

process.stdin.on('end', function() {
  var inputJSON = inputChunks.join(),
    parsed = JSON.parse(inputJSON);

    programs = parsed.programs ? parsed.programs : parsed;
    createPrograms(programs);
});
