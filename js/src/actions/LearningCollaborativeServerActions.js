import AppDispatcher from '../dispatcher/AppDispatcher';

import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const LearningCollaborativeServerActions = {
  receiveProgram: function(program, method) {
    AppDispatcher.handleServerAction({
      actionType: LearningCollaborativeConstants.RECEIVE_PROGRAM,
      program: program,
      method: method
    });
  },

  receiveProgramNote: function(program, note) {
    AppDispatcher.handleServerAction({
      actionType: LearningCollaborativeConstants.RECEIVE_PROGRAM_NOTE,
      program: program,
      note: note
    });
  }
}

export default LearningCollaborativeServerActions;
