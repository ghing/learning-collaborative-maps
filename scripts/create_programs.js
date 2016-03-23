#!/usr/bin/env node

var async = require('async');
var request = require('request');

var LC_API_URL = process.env.LC_API_URL || 'http://localhost:3000/api/1'; 
var SCHOOLS_ENDPOINT = LC_API_URL + '/schools';

var programs = [
  {
    school: '/schools/150162990250035',
    agency: '/agencies/between-friends',
    age_group: '9-12'
  },
  {
    school: '/schools/150162990252391',
    agency: '/agencies/between-friends',
    age_group: '7-8'
  },
  {
    school: '/schools/15016299025217C',
    agency: '/agencies/between-friends',
    age_group: '6-9'
  },
  {
    school: '/schools/150162990252203',
    agency: '/agencies/apna-ghar',
  },
  {
    school: '/schools/150162990252391',
    agency: '/agencies/rva',
    age_group: 'K-2'
  }
];

var programSchools = Object.keys(programs.reduce(function(lookup, program) {
  lookup[program.school] = true;
  return lookup;
}, {}));

async.forEach(programSchools, function(school, callback) {
  request({
    url: LC_API_URL + school + '/programs',
    method: 'DELETE'
  }, function(error, response) {
    callback();
  });
}, function(err) {
  programs.forEach(function(program) {
    var programProps = {
      agency: program.agency,
      age_group: program.age_group
    };
    request({
      url: LC_API_URL + program.school + '/programs',
      method: 'POST',
      json: programProps
    }, function(error, response) {
    
    });
  })
});
