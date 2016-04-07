var ObjectID = require('mongodb').ObjectID;


function createSchools(schools, db, callback) {
  var collection = db.collection('schools');
  collection.insertMany(schools, function(err, result) {
    console.log("Created " + result.insertedCount + " schools");
    callback(result);
  });
}

function fixProgramAgency(agencyLookup, program) {
  console.log(program.agency);
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
      callback();
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

module.exports = {
  createSchools: createSchools,
  fixSchoolProgramAgencies: fixSchoolProgramAgencies,
  getSchools: getSchools,
  deleteSchools: deleteSchools,
  createAgencies: createAgencies,
  deleteAgencies: deleteAgencies,
  getAgencies: getAgencies,
  deleteSchoolPrograms: deleteSchoolPrograms,
  addSchoolProgram: addSchoolProgram,
  geoJsonCollection: geoJsonCollection,
  deletePrograms: deletePrograms
};
