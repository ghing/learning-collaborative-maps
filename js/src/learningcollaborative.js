import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

import LearningCollaborativeApi from './utils/LearningCollaborativeApi';
import LearningCollaborativeActions from './actions/LearningCollaborativeActions';
import routes from './routes';


export const MapApp = function(options) {
  ReactDOM.render(
    <Router history={browserHistory} routes={routes} />,
    options.container
  );

  LearningCollaborativeApi.schools().then(LearningCollaborativeActions.setSchools);
  LearningCollaborativeApi.agencies().then(LearningCollaborativeActions.setAgencies);
};
