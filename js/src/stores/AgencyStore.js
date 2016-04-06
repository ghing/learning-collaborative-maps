import assign from 'object-assign';
import d3 from 'd3';
import {EventEmitter} from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher'; 
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const CHANGE_EVENT = 'change';

let _agencies = []; // Collection of agency items
let _agencyLookup = {};
let _agencyColorScale = d3.scale.ordinal();

let AgencyStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _agencies;
  },

  getLookup: function() {
    return _agencyLookup;
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

    switch(action.actionType) {
      case LearningCollaborativeConstants.AGENCIES_SET:
        _agencies = action.agencies;
        _agencies.sort((a, b) => {
          if (a.properties.agency < b.properties.agency) {
            return -1;
          }

          if (a.properties.agency > b.properties.agency) {
            return 1;
          }

          return 0;
        });

        _agencyLookup = _agencies.reduce(function(lookup, agency) {
          lookup[agency.properties.slug] = agency;
          return lookup;
        }, {});

        _agencyColorScale.domain(_agencies.map(function(agency) {
          return agency.properties.slug;
        }));

        _agencyColorScale.range(_agencies.map(function(agency) {
          return agency.properties.marker_color;
        }));

        AgencyStore.emitChange();
        break;
    }

    return true;
  })
});

export default AgencyStore;
