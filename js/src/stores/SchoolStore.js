import assign from 'object-assign';
import {EventEmitter} from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher'; 
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const CHANGE_EVENT = 'change';

let _schools = []; // Collection of school items

let SchoolStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _schools;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;
    let schools;

    switch(action.actionType) {
      case LearningCollaborativeConstants.SCHOOLS_SET:
        schools = action.schools;
        _schools = schools;
        SchoolStore.emitChange();
        break;
    }

    return true;
  })
});

export default SchoolStore;
