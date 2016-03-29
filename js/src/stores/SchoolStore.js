import assign from 'object-assign';
import {EventEmitter} from 'events';
import Bloodhound from 'typeahead.js/dist/bloodhound';

import AppDispatcher from '../dispatcher/AppDispatcher';
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const CHANGE_EVENT = 'change';

let _schools = []; // Collection of school items

var _engine;

let SchoolStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _schools;
  },

  getEngine: function() {
    return _engine;
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

    switch(action.actionType) {
      case LearningCollaborativeConstants.SCHOOLS_SET:
        _schools = action.schools;
        _engine = new Bloodhound({
          local: _schools,
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          datumTokenizer: school => Bloodhound.tokenizers.whitespace(school.properties.FacilityName),
          identify: school => school.properties.rcdts
        });
        SchoolStore.emitChange();
        break;
    }

    return true;
  })
});

export default SchoolStore;
