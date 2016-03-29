import AppDispatcher from '../dispatcher/AppDispatcher';

import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const LearningCollaborativeServerActions = {
  receiveProgram: function(program) {
    AppDispatcher.handleServerAction({
      actionType: LearningCollaborativeConstants.RECEIVE_PROGRAM,
      program: program
    });
  }
}

export default LearningCollaborativeServerActions;
