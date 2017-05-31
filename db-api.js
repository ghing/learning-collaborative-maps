var ObjectID = require('mongodb').ObjectID;


function createSchools(schools, db, callback) {
  var collection = db.collection('schools');
  collection.insertMany(schools, function(err, result) {
    console.log("Created " + result.insertedCount + " schools");
    callback(result);
  });
}

function updateSchool(school, db, callback) {
  var collection = db.collection('schools');
  const updateSchool = {
    'rcdts': school.rcdts,
    'FacilityName': school.FacilityName,
    'Address': school.Address,
    'City': school.City,
    'Zip': school.Zip,
    'GradeServed': school.GradeServed,
    'lat': school.lat,
    'lng': school.lng
  };

  collection.updateOne(
    {'rcdts': school.rcdts},
    {
      $set: updateSchool
    },
    function (err, results) {
      callback(err, updateSchool);
    }
  );
}

function fixProgramAgency(agencyLookup, program) {
  var agency = agencyLookup[program.agency];

  program.agency = '/api/1/agencies/' + agency.slug;

  return program;
}

function fixSchoolProgramAgencies(agencyLookup, school) {
  if (!school.programs) {
    return school;
  }

  school.programs = school.programs.map(fixProgramAgency.bind(undefined, agencyLookup));
  return school;
}

function getSchools(condition, db, callback) {
  db.collection('schools').find(condition).toArray(function(err, docs) {
    console.log("Retrieved " + docs.length + " schools");
    callback(docs);
  });
}

function deleteSchools(condition, db, callback) {
  db.collection('schools').deleteMany(condition, function(err, results) {
     console.log("Deleted schools");
     callback();
  });
}

function featureGeoJson(feature) {
  var coordinates = [feature.lng, feature.lat];
  var props = Object.keys(feature).reduce(function(props, prop) {
    if (prop != 'lat' && prop != 'lng') {
      props[prop] = feature[prop];
    }
    return props;
  }, {});
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coordinates
    },
    properties: props
  };
}

function geoJsonCollection(features) {
  return {
    type: "FeatureCollection",
    features: features.map(featureGeoJson)
  };
}

function createAgencies(agencies, db, callback) {
  var collection = db.collection('agencies');
  collection.insertMany(agencies, function(err, result) {
    console.log("Created " + result.insertedCount + " agencies");
    callback(result);
  });
}

function updateAgency(agency, db, callback) {
  const collection = db.collection('agencies');
  const agencyToUpdate = {
    slug: agency.slug,
    agency: agency.agency,
    catchment_area: agency.catchment_area,
    program_type: agency.program_type,
    office_location: agency.office_location,
    lng: agency.lng,
    lat: agency.lat,
    marker_color: agency.marker_color
  };

  collection.updateOne(
    {'slug': agency.slug},
    {$set: agencyToUpdate},
    function (err, results) {
      callback(err, agencyToUpdate);
    }
  );
}

function deleteAgencies(condition, db, callback) {
  db.collection('agencies').deleteMany(condition, function(err, results) {
    console.log("Deleted agencies");
    callback();
  });
}

function getAgencies(condition, db, callback) {
  var collection = db.collection('agencies');

  collection.find(condition).toArray(function(err, docs) {
    console.log("Retrieved " + docs.length + " agencies");
    callback(docs);
  });
}

function deleteSchoolPrograms(school, db, callback) {
  var collection = db.collection('schools');
  collection.updateOne(
    {
      'rcdts': school.rcdts
    },
    {
      $set: {
        'programs': []
      }
    },
    function(err, results) {
      callback();
    }
  );
}

function addSchoolProgram(school, program, db, callback) {
  var insertProgram = Object.assign({}, program);

  // If a program does not have an ID specified,
  // create one
  if (!insertProgram._id) {
    insertProgram._id = new ObjectID();
  }

  db.collection('schools').updateOne(
    {
      rcdts: school.rcdts
    },
    {
      $push: {
        programs: insertProgram
      }
    },
    function(err, results) {
      callback(err, insertProgram);
    }
  );
}

function updateSchoolProgram(school, program, db, callback) {
  db.collection('schools').updateOne(
    {
      rcdts: school.rcdts,
      "programs._id": new ObjectID(program._id)
    },
    {
      $set: {
        "programs.$.agency": program.agency,
        "programs.$.age_group": program.age_group,
        "programs.$.program_type": program.program_type,
        "programs.$.dates": program.dates
      }
    },
    function(err, results) {
      // Get the full program, including it's notes field
      // as the posted program might not have all fields
      db.collection('schools').findOne(
        {
          rcdts: school.rcdts
        },
        function(err, foundSchool) {
          var i;
          var p;
          for (i = 0; i < foundSchool.programs.length; i++) {
            p = foundSchool.programs[i];
            if (p._id.equals(new ObjectID(program._id))) {
              callback(err, p);
              return;
            }
          }
          // TODO: Handle weird case where matching program
          // is not found
        }
      );
    }
  );
}

function deletePrograms(db, callback) {
  db.collection('schools').updateMany({}, {
    $unset: {
      programs: null
    },
    function(err, results) {
      callback();
    }
  });
}

function createProgramNote(db, school, program, note, callback) {
  var insertNote = Object.assign({}, note);
  var programIndex;
  for (programIndex = 0; programIndex <= school.programs.length; programIndex++) {
    if (school.programs[programIndex]._id == program._id) {
      break;
    }
  }

  if (!insertNote._id) {
    insertNote._id = new ObjectID();
  }

  var programQuery = 'programs.' + programIndex + '.notes';
  var query = {
    $addToSet: {}
  };
  query.$addToSet[programQuery] = insertNote;

  db.collection('schools').updateOne(
    {
      rcdts: school.rcdts
    },
    query,
    function(err, results) {
      callback(err, insertNote);
    }
  );
}

function updateProgramNote(db, school, program, note, callback) {
  var programIndex;
  for (programIndex = 0; programIndex <= school.programs.length; programIndex++) {
    if (school.programs[programIndex]._id === program._id) {
      break;
    }
  }

  var programQuery = 'programs.' + programIndex + '.notes.0.text';
  var query = {
    $set: {}
  };
  query.$set[programQuery] = note.text;

  db.collection('schools').updateOne(
    {
      rcdts: school.rcdts
    },
    query,
    function(err, results) {
      callback(err, note);
    }
  );
}

function getOrCreateUser(db, user, callback) {
  db.collection('users').findAndModify(
    {
      email: user.email,
    },
    [['_id', 'asc']],
    {
      $setOnInsert: {
        email: user.email
      }
    },
    {
      new: true,
      upsert: true
    },
    function(err, result) {
      callback(result.value);
    });
}

module.exports = {
  createSchools: createSchools,
  updateSchool: updateSchool,
  fixSchoolProgramAgencies: fixSchoolProgramAgencies,
  getSchools: getSchools,
  deleteSchools: deleteSchools,
  createAgencies: createAgencies,
  updateAgency: updateAgency,
  deleteAgencies: deleteAgencies,
  getAgencies: getAgencies,
  deleteSchoolPrograms: deleteSchoolPrograms,
  addSchoolProgram: addSchoolProgram,
  updateSchoolProgram: updateSchoolProgram,
  geoJsonCollection: geoJsonCollection,
  deletePrograms: deletePrograms,
  createProgramNote: createProgramNote,
  updateProgramNote: updateProgramNote,
  getOrCreateUser: getOrCreateUser
};
