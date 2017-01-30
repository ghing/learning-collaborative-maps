import LearningCollaborativeApp from './components/LearningCollaborativeApp';
import LearningCollaborativeMap from './components/LearningCollaborativeMap';
import ProgramForm from './components/ProgramForm';
import SchoolDetail from './components/SchoolDetail';
import LoginForm from './components/LoginForm';

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
      path: 'login',
      component: LoginForm
    },
    {
      path: 'schools',
      component: LearningCollaborativeMap,
      childRoutes: [
        {
          path: ':schoolId',
          component: SchoolDetail,
          childRoutes: [
            {
              path: 'programs/add',
              component: ProgramForm
            },
            {
              path: 'programs/:programId/edit',
              component: ProgramForm
            }
          ]
        }
      ]
    }
  ]
};

export default routes;
