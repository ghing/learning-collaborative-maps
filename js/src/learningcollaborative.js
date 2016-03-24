import React from 'react';
import ReactDOM from 'react-dom';
import XMLHttpRequestPromise from 'xhr-promise';

import LearningCollaborativeActions from './actions/LearningCollaborativeActions';
import LearningCollaborativeMap from './components/LearningCollaborativeMap'; 

export const LearningCollaborativeMapApp = function(options) {
  let xhrPromise = new XMLHttpRequestPromise();
  // HACK: I don't know why you have to make 2 separate instances, but you do!
  let xhrPromise2 = new XMLHttpRequestPromise();

  ReactDOM.render(
    <LearningCollaborativeMap />,
    options.container
  );

  xhrPromise.send({
    method: 'GET',
    url: options.schoolsJSONURL
  }).then(function(response) {
    LearningCollaborativeActions.setSchools(response.responseText.features);
  });

  xhrPromise2.send({
    method: 'GET',
    url: options.agenciesJSONURL
  }).then(function(response) {
    LearningCollaborativeActions.setAgencies(response.responseText.features);
  });
};
