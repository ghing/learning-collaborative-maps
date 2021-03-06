/**
 * Express route handlers
 */

var passwordless = require('passwordless');

var dbApi = require('./db-api');
var currentSchoolYear = require('./utils').currentSchoolYear;


// Agencies

function getAgencies(req, res) {
  var format = req.query.format || 'json';
  dbApi.getAgencies({}, req.dbConnection, function(agencies) {
    if (format == 'geojson') {
      res.json(dbApi.geoJsonCollection(agencies));
    }
    else {
      res.json(agencies);
    }
  });
}

function createAgency(req, res) {
  var agencies = req.body;
  if (!agencies.length) {
    agencies = [agencies];
  }
  dbApi.createAgencies(agencies, req.dbConnection, function() {
    res.status(201).json(agencies);
  });
}

function deleteAgency(req, res) {
  dbApi.deleteAgencies({}, req.dbConnection, function() {
    res.json();
  });
}

function setAgencySlug(req, res, next, agencySlug) {
  dbApi.getAgencies({slug: agencySlug}, req.dbConnection, function(agencies) {
    req.agency = agencies[0];
    next();
  });
}

function getAgency(req, res) {
  res.json(req.agency);
}

function updateAgency(req, res) {
  var agency = req.body;
  dbApi.updateAgency(agency, req.dbConnection, function() {
    res.status(200).json(agency);
  });
}

// Schools

function getSchools(req, res) {
  var format = req.query.format || 'json';
  getSchoolsWithProgramAgencies(req.dbConnection, function(err, schools) {
    if (format == 'geojson') {
      res.json(dbApi.geoJsonCollection(schools));
    }
    else {
      res.json(schools);
    }
  });
}

function createSchool(req, res) {
  var schools = req.body;
  if (!schools.length) {
    schools = [schools];
  }
  dbApi.createSchools(schools, req.dbConnection, function() {
    res.status(201).json(schools);
  });
}

function updateSchool(req, res) {
  var school = req.body;
  dbApi.updateSchool(school, req.dbConnection, function() {
    res.status(200).json(school);
  });
}

function deleteSchool(req, res) {
  dbApi.deleteSchools({}, req.dbConnection, function() {
    res.json();
  });
}

function setRcdts(req, res, next, rcdts) {
  dbApi.getSchools({rcdts: rcdts}, req.dbConnection, function(schools) {
    req.school = schools[0];
    next();
  });
}

function getSchool(req, res) {
  res.json(req.school);
}


// Programs

function deleteAllSchoolPrograms(req, res) {
  dbApi.deleteSchoolPrograms(req.school, req.dbConnection, function() {
    res.json();
  });
}

function createProgram(req, res) {
  var program = req.body;
  var agencyUrlBits = program.agency.split('/');
  var agencySlug = agencyUrlBits[agencyUrlBits.length - 1];
  var schoolYear = currentSchoolYear();

  dbApi.getAgencies({'slug': agencySlug}, req.dbConnection, function(agencies) {
    var agency = agencies[0];
    var programProps = {
      agency: agency.slug,
      age_group: program.age_group,
      program_type: program.program_type,
      dates: program.dates,
      schoolYearStart: schoolYear[0]
    };
    dbApi.addSchoolProgram(req.school, programProps, req.dbConnection, function(err, program) {
      res.status(201).json(program);
    });
  });
}

function getSchoolsWithProgramAgencies(dbConnection, callback) {
  dbApi.getAgencies({}, dbConnection, function(agencies) {
    var agencyLookup = agencies.reduce(function(lookup, agency) {
      lookup[agency.slug] = agency;
      return lookup;
    }, {});

    dbApi.getSchools({}, dbConnection, function(schools) {
      callback(null, schools.map(dbApi.fixSchoolProgramAgencies.bind(undefined, agencyLookup)));
    });
  });
}

function getPrograms(req, res) {
  getSchoolsWithProgramAgencies(req.dbConnection, function(err, schools) {
    res.json({
      programs: schools.reduce(function(programs, school) {
        if (school.programs) {
          school.programs.forEach(function(program) {
            programs.push(Object.assign({}, program, {
              school: '/api/1/schools/' + school.rcdts
            }));
          });
        }
        return programs;
      }, [])
    });
  });
}

function deleteAllPrograms(req, res) {
  dbApi.deletePrograms(req.dbConnection, function() {
    res.json();
  });
}

function setProgramId(req, res, next, programId) {
  req.programId = programId;
  next();
}

function updateProgram(req, res) {
  var program = req.body;
  var agencyUrlBits = program.agency.split('/');
  var agencySlug = agencyUrlBits[agencyUrlBits.length - 1];
  dbApi.getAgencies({'slug': agencySlug}, req.dbConnection, function(agencies) {
    var agency = agencies[0];
    var programProps = {
      _id: req.programId,
      agency: agency.slug,
      age_group: program.age_group,
      program_type: program.program_type,
      dates: program.dates
    };
    dbApi.updateSchoolProgram(req.school, programProps, req.dbConnection, function(err, program) {
      res.status(200).json(program);
    });
  });
}

function createProgramNote(req, res) {
  var note = req.body;
  var program = req.school.programs.find(function(program) {
    return program._id == req.programId;
  });
  // TODO: Handle case when matching program is not found
  dbApi.createProgramNote(req.dbConnection, req.school, program, note, function(err, note) {
    res.status(201).json(note);
  });
}

function updateProgramNote(req, res) {
 var note = req.body;
 var program = req.school.programs.find(function(program) {
   return program._id == req.programId;
 });
 dbApi.updateProgramNote(req.dbConnection, req.school, program, note, function(err, note) {
   res.status(200).json(note);
 });
}

var createLoginToken = passwordless.requestToken(function(email, delivery, callback, req) {
  var user = {
    email: email
  };

  dbApi.getOrCreateUser(req.dbConnection, user, function(user) {
    if (user) {
      callback(null, user._id)
    }
    else {
      callback(null, null);
    }
  });
},
{
  userField: 'email'
});

function sendCreatedUser(req, res) {
  var user = req.body;
  res.status(201).json(user);
}

// TODO: Is there a way to declare and export the function at once,
// other than using the ES6 syntax?
module.exports = {
 getAgencies: getAgencies,
 createAgency: createAgency,
 updateAgency: updateAgency,
 deleteAgency: deleteAgency,
 setAgencySlug: setAgencySlug,
 getAgency: getAgency,
 getSchools: getSchools,
 createSchool: createSchool,
 deleteSchool: deleteSchool,
 setRcdts: setRcdts,
 getSchool: getSchool,
 updateSchool: updateSchool,
 deleteAllSchoolPrograms: deleteAllSchoolPrograms,
 createProgram: createProgram,
 updateProgram: updateProgram,
 getPrograms: getPrograms,
 deleteAllPrograms: deleteAllPrograms,
 setProgramId: setProgramId,
 createProgramNote: createProgramNote,
 updateProgramNote: updateProgramNote,
 createLoginToken: createLoginToken,
 sendCreatedUser: sendCreatedUser
};
