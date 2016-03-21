import React from 'react';
import ReactDOM from 'react-dom';
import XMLHttpRequestPromise from 'xhr-promise';

import LearningCollaborativeMap from './views/LearningCollaborativeMap'; 

export const LearningCollaborativeMapApp = function(options) {
  let xhrPromise = new XMLHttpRequestPromise();

  xhrPromise.send({
    method: 'GET',
    url: options.schoolsJSONURL
  }).then(function(response) {
    ReactDOM.render(
      <LearningCollaborativeMap schools={response.responseText.features} />,
      options.container
    );
  });

};
