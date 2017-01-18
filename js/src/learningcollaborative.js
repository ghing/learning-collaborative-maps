import React from 'react';
import ReactDOM from 'react-dom';

import LearningCollaborativeApi from './utils/LearningCollaborativeApi';
import LearningCollaborativeActions from './actions/LearningCollaborativeActions';
import LearningCollaborativeMap from './components/LearningCollaborativeMap'; 

export const MapApp = function(options) {
  ReactDOM.render(
    <LearningCollaborativeMap />,
    options.container
  );

  LearningCollaborativeApi.schools().then(LearningCollaborativeActions.setSchools);
  LearningCollaborativeApi.agencies().then(LearningCollaborativeActions.setAgencies);
};
