import AppDispatcher from '../dispatcher/AppDispatcher';
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const LearningCollaborativeActions = {
  setSchools: function(schools) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.SCHOOLS_SET,
      schools: schools
    });
  },

  setAgencies: function(agencies) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.AGENCIES_SET,
      agencies: agencies
    });
  },

  createProgram: function(school, agency, ageGroup) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.CREATE_PROGRAM,
      school: school,
      agency: agency,
      ageGroup: ageGroup
    });
  }
};

export default LearningCollaborativeActions;
