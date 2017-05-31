import es6Promise from 'es6-promise';
es6Promise.polyfill();
import 'isomorphic-fetch';

const SCHOOLS_JSON_URL = '/api/1/schools';
const SCHOOL_JSON_URL = '/api/1/schools/:rcdts';
const AGENCIES_JSON_URL = '/api/1/agencies';
const AGENCY_JSON_URL = '/api/1/agencies/:slug';
const SCHOOL_PROGRAMS_JSON_URL = '/api/1/schools/:rcdts/programs';
const SCHOOL_PROGRAM_JSON_URL = '/api/1/schools/:rcdts/programs/:programId';
const SCHOOL_PROGRAM_NOTES_JSON_URL = '/api/1/schools/:rcdts/programs/:programId/notes';
const SCHOOL_PROGRAM_NOTE_JSON_URL = '/api/1/schools/:rcdts/programs/:programId/notes/:noteId';
const LOGIN_TOKEN_REQUEST_URL = '/api/1/auth/tokens';

const LearningCollaborativeApi = {
  schools: function() {
    return fetch(SCHOOLS_JSON_URL + '?format=geojson')
      .then(response => response.json())
      .then(json => json.features);
  },

  agencies: function() {
    return fetch(AGENCIES_JSON_URL + '?format=geojson')
      .then(response => response.json())
      .then(json => json.features);
  },

  createAgency: function (
    slug,
    agency,
    catchmentArea,
    programType,
    officeLocation,
    lat,
    lng,
    markerColor
  ) {
    const url = AGENCIES_JSON_URL;

    const agencyObj = {
      slug: slug,
      agency: agency,
      catchment_area: catchmentArea,
      program_type: programType,
      office_location: officeLocation,
      lng: lng,
      lat: lat,
      marker_color: markerColor
    };

    return fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(agencyObj)
    }).then(response => response.json())
    .then(json => json[0]);
  },

  updateAgency: function (
    slug,
    agency,
    catchmentArea,
    programType,
    officeLocation,
    lat,
    lng,
    markerColor
  ) {
    const url = AGENCY_JSON_URL.replace(':slug', slug);

    const agencyObj = {
      slug: slug,
      agency: agency,
      catchment_area: catchmentArea,
      program_type: programType,
      office_location: officeLocation,
      lng: lng,
      lat: lat,
      marker_color: markerColor
    };

    return fetch(url, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(agencyObj)
    }).then(response => response.json());
  },

  createSchool: function(rcdts, name, address, city, zip, gradeServed, lat, lng) {
    const url = SCHOOLS_JSON_URL;

    const school = {
      rcdts: rcdts,
      FacilityName: name,
      Address: address,
      City: city,
      GradeServed: gradeServed,
      Zip: zip,
      lat: lat,
      lng: lng
    };

    return fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(school)
    }).then(response => response.json())
    .then(json => json[0]);
  },

  updateSchool: function(rcdts, name, address, city, gradeServed, zip, lat, lng) {
    const url = SCHOOL_JSON_URL.replace(':rcdts', rcdts);

    const school = {
      rcdts: rcdts,
      FacilityName: name,
      Address: address,
      City: city,
      GradeServed: gradeServed,
      Zip: zip,
      lat: lat,
      lng: lng
    };

    return fetch(url, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(school)
    }).then(response => response.json())
      .then(json => json);
  },

  createProgram: function(school, agency, ageGroup, programType, dates) {
    let program = {
      agency: '/agencies/' + agency.properties.slug,
      age_group: ageGroup
    };
    let url = SCHOOL_PROGRAMS_JSON_URL.replace(':rcdts', school.properties.rcdts);

    if (programType) {
      program.program_type = programType;
    }

    if (dates) {
      program.dates = dates;
    }

    return fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(program)
    }).then(response => response.json())
      .then(json => json);
  },

  updateProgram: function(school, program, agency, ageGroup, programType, dates) {
    let url = SCHOOL_PROGRAM_JSON_URL
      .replace(':rcdts', school.properties.rcdts)
      .replace(':programId', program._id);
    let programReq = {
      agency: '/agencies/' + agency.properties.slug,
      age_group: ageGroup,
      program_type: programType,
      dates: dates
    };

    return fetch(url, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(programReq)
    }).then(response => response.json())
      .then(json => json);
  },

  createProgramNote: function(school, program, note) {
    let url = SCHOOL_PROGRAM_NOTES_JSON_URL
      .replace(':rcdts', school.properties.rcdts)
      .replace(':programId', program._id);
      let noteReq = {
        text: note
      };

    return fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(noteReq)
    }).then(response => response.json())
      .then(json => json);
  },

  updateProgramNote: function(school, program, note) {
    let url = SCHOOL_PROGRAM_NOTE_JSON_URL
      .replace(':rcdts', school.properties.rcdts)
      .replace(':programId', program._id)
      .replace(':noteId', note._id);

    return fetch(url, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    }).then(response => response.json())
      .then(json => json);
  },

  requestLoginToken: function(user) {
    let url = LOGIN_TOKEN_REQUEST_URL;

    return fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }).then(response => response.json())
      .then(json => json);
  }
};

export default LearningCollaborativeApi;
