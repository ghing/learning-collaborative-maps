import React from 'react';
import ReactDOM from 'react-dom';
import XMLHttpRequestPromise from 'xhr-promise';

import LearningCollaborativeActions from './actions/LearningCollaborativeActions';
import LearningCollaborativeMap from './components/LearningCollaborativeMap'; 

export const LearningCollaborativeMapApp = function(options) {
  let xhrPromise = new XMLHttpRequestPromise();

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
};
