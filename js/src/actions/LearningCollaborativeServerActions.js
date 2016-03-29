import AppDispatcher from '../dispatcher/AppDispatcher';

import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const LearningCollaborativeServerActions = {
  receiveSchool: function(schoool) {
    AppDispatcher.handleServerAction({
      actionType: LearningCollaborativeConstants.RECEIVE_SCHOOL
    });
  }
}

