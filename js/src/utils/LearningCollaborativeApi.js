import es6Promise from 'es6-promise';
es6Promise.polyfill();
import 'isomorphic-fetch';

const SCHOOLS_JSON_URL = '/api/1/schools?format=geojson';
const AGENCIES_JSON_URL = '/api/1/agencies?format=geojson';
const SCHOOL_PROGRAM_JSON_URL = '/api/1/schools/:rcdts/programs';
const SCHOOL_PROGRAM_NOTE_JSON_URL = '/api/1/schools/:rcdts/programs/:programId/notes';

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
    let url = SCHOOL_PROGRAM_JSON_URL.replace(':rcdts', school.properties.rcdts);

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

  createProgramNote: function(school, program, note) {
    let url = SCHOOL_PROGRAM_NOTE_JSON_URL
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
  }
};

export default LearningCollaborativeApi;
