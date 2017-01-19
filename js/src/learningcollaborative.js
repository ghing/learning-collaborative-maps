import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

import LearningCollaborativeApi from './utils/LearningCollaborativeApi';
import LearningCollaborativeActions from './actions/LearningCollaborativeActions';
import LearningCollaborativeApp from './components/LearningCollaborativeApp';
import LearningCollaborativeMap from './components/LearningCollaborativeMap';

const routes = {
  path: '/',
  component: LearningCollaborativeApp,
  // Use an index redirect to make it easy to show the map at both
  // '/' and '/schools'.  This makes for coherent routes when
  // we add a '/school/:id' router.
  // See https://github.com/ReactTraining/react-router/blob/master/docs/guides/IndexRoutes.md#index-redirects
  indexRoute: { onEnter: (nextState, replace) => replace('/schools') },
  childRoutes: [
    {
      path: 'schools',
      component: LearningCollaborativeMap
    }
  ]
};

export const MapApp = function(options) {
  ReactDOM.render(
    <Router history={browserHistory} routes={routes} />,
    options.container
  );

  LearningCollaborativeApi.schools().then(LearningCollaborativeActions.setSchools);
  LearningCollaborativeApi.agencies().then(LearningCollaborativeActions.setAgencies);
};
