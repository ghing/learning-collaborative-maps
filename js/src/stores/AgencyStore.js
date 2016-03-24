import assign from 'object-assign';
import d3 from 'd3';
import {EventEmitter} from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher'; 
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const CHANGE_EVENT = 'change';

let _agencies = []; // Collection of school items
let _agencyColorScale = d3.scale.category20();

let AgencyStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _agencies;
  },

  getColorScale: function() {
    return _agencyColorScale;
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
    let agencies;

    switch(action.actionType) {
      case LearningCollaborativeConstants.AGENCIES_SET:
        agencies = action.agencies;
        _agencies = agencies;
        _agencyColorScale.domain(_agencies.map(function(agency) {
          return agency.properties.slug;
        }));
        AgencyStore.emitChange();
        break;
    }

    return true;
  })
});

export default AgencyStore;
