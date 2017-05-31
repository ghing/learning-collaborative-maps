import LearningCollaborativeApp from './components/LearningCollaborativeApp';
import LearningCollaborativeMap from './components/LearningCollaborativeMap';
import ProgramForm from './components/ProgramForm';
import SchoolDetail from './components/SchoolDetail';
import LoginForm from './components/LoginForm';
import Admin from './components/Admin';
import AgenciesAdmin from './components/AgenciesAdmin';
import AgenciesAdminForm from './components/AgenciesAdminForm';
import SchoolsAdmin from './components/SchoolsAdmin';
import SchoolsAdminForm from './components/SchoolsAdminForm';

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
    },
    {
      path: 'admin',
      component: Admin,
      childRoutes: [
        {
          path: 'schools',
          component: SchoolsAdmin,
          childRoutes: [
            {
              path: 'add',
              component: SchoolsAdminForm
            },
            {
              path: ':schoolId',
              component: SchoolsAdminForm
            }
          ]
        },
        {
          path: 'agencies',
          component: AgenciesAdmin,
          childRoutes: [
            {
              path: 'add',
              component: AgenciesAdminForm
            },
            {
              path: ':slug',
              component: AgenciesAdminForm
            }
          ]
        }
      ]
    }
  ]
};

export default routes;
