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

  receiveProgramNote: function(program, note, method) {
    AppDispatcher.handleServerAction({
      actionType: LearningCollaborativeConstants.RECEIVE_PROGRAM_NOTE,
      program: program,
      note: note,
      method: method
    });
  },

  receiveLoginUser: function(user) {
    AppDispatcher.handleServerAction({
      actionType: LearningCollaborativeConstants.RECEIVE_LOGIN_USER,
      user: user
    });
  }
};

export default LearningCollaborativeServerActions;
