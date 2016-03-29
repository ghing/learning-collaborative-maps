import XMLHttpRequestPromise from 'xhr-promise';

import LearningCollaborativeServerActions from './action.LearningCollaborativeServerActions';

const SCHOOLS_JSON_URL = '/api/1/schools?format=geojson';
const AGENCIES_JSON_URL = '/api/1/agencies?format=geojson';
const SCHOOL_PROGRAM_JSON_URL = '/api/1/schools/:rcdts/programs'

const LearningCollaborativeApi = {
  schools: function() {
    let xhrPromise = new XMLHttpRequestPromise();
    return xhrPromise.send({
      method: 'GET',
      url: SCHOOLS_JSON_URL
    }).then(function(response) {
      return response.responseText.features;
    });
  },

  agencies: function() {
    let xhrPromise = new XMLHttpRequestPromise();
    return xhrPromise.send({
      method: 'GET',
      url: AGENCIES_JSON_URL
    }).then(function(response) {
      return response.responseText.features;
    });
  },

  createProgram: function(school, agency, ageGroup, programType) {
    let xhrPromise = new XMLHttpRequestPromise();
    return xhrPromise.send({
      method: 'POST',
    let xhrPromise = new XMLHttpRequestPromise();
    return xhrPromise.send({
      url: SCHOOL_PROGRAM_JSON_URL.
      method: 'POST'
  });

export default LearningCollaborativeApi;
