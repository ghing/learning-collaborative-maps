import assign from 'object-assign';
import {EventEmitter} from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher';
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const LOGIN_USER_RECEIVED_EVENT = 'receive:loginuser';

const UserStore = assign({}, EventEmitter.prototype, {
  emitLoginUserReceived: function(user) {
    this.emit(LOGIN_USER_RECEIVED_EVENT, user);
  },

  addLoginUserReceivedListener: function(callback) {
    this.on(LOGIN_USER_RECEIVED_EVENT, callback);
  },

  removeLoginUserReceivedListener: function(callback) {
    this.removeListener(LOGIN_USER_RECEIVED_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;

    switch(action.actionType) {
      case LearningCollaborativeConstants.RECEIVE_LOGIN_USER:
        UserStore.emitLoginUserReceived(action.user);
        break;
    }

    return true;
  })
});

export default UserStore;
