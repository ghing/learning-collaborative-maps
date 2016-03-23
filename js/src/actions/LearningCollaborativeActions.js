import AppDispatcher from '../dispatcher/AppDispatcher';
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const LearningCollaborativeActions = {
  setSchools: function(schools) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.SCHOOLS_SET,
      schools: schools
    });
  }
};

export default LearningCollaborativeActions;
