import React from 'react';
import ReactDOM from 'react-dom';

import LearningCollaborativeApi from './LearningCollaborativeApi';
import LearningCollaborativeActions from './actions/LearningCollaborativeActions';
import LearningCollaborativeMap from './components/LearningCollaborativeMap'; 

export const LearningCollaborativeMapApp = function(options) {
  ReactDOM.render(
    <LearningCollaborativeMap />,
    options.container
  );

  LearningCollaborativeApi.schools().then(schools => {
    LearningCollaborativeActions.setSchools(schools);
  });

  LearningCollaborativeApi.agencies().then(agencies => {
    LearningCollaborativeActions.setAgencies(agencies);
  });
};
