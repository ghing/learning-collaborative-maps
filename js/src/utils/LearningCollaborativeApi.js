import es6Promise from 'es6-promise';
es6Promise.polyfill();
import 'isomorphic-fetch';

const SCHOOLS_JSON_URL = '/api/1/schools?format=geojson';
const AGENCIES_JSON_URL = '/api/1/agencies?format=geojson';
const SCHOOL_PROGRAMS_JSON_URL = '/api/1/schools/:rcdts/programs';
const SCHOOL_PROGRAM_JSON_URL = '/api/1/schools/:rcdts/programs/:programId';
const SCHOOL_PROGRAM_NOTES_JSON_URL = '/api/1/schools/:rcdts/programs/:programId/notes';
const SCHOOL_PROGRAM_NOTE_JSON_URL = '/api/1/schools/:rcdts/programs/:programId/notes/:noteId';
const LOGIN_TOKEN_REQUEST_URL = '/api/1/auth/tokens';

const LearningCollaborativeApi = {
  schools: function() {
    return fetch(SCHOOLS_JSON_URL)
      .then(response => response.json())
      .then(json => json.features);
  },

  agencies: function() {
    return fetch(AGENCIES_JSON_URL)
      .then(response => response.json())
      .then(json => json.features);
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
