import AppDispatcher from '../dispatcher/AppDispatcher';

import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const LearningCollaborativeServerActions = {
  receiveProgram: function(program) {
    AppDispatcher.handleServerAction({
      actionType: LearningCollaborativeConstants.RECEIVE_PROGRAM,
      program: program
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
