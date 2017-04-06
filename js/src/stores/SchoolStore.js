import assign from 'object-assign';
import {EventEmitter} from 'events';
// Bloodhound doesn't seem to work outside the browser.
// Load it conditionally.
if (typeof window != 'undefined') {
  var Bloodhound = require('typeahead.js/dist/bloodhound');
}

import AppDispatcher from '../dispatcher/AppDispatcher';
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const CHANGE_EVENT = 'change';
const RECEIVE_PROGRAM_EVENT = 'receive:program';
const RECEIVE_PROGRAM_NOTE_EVENT = 'receive:programNote';
const ZOOM_TO_MARKER_EVENT = 'marker:zoom';

let _schools = []; // Collection of school items
let _schoolLookup = {};
// TODO: Don't hard-code these, instead allow adding/editing them through
// an admin interface.
// See https://github.com/ghing/learning-collaborative-maps/issues/59
let _programTypes = [
  'Community Violence',
  'Dating/Partner Violence',
  'Dating/Partner Violence/Bullying',
  'General Health',
  'Leadership Development',
  'Prevention + Intervention',
  'Sexual Health',
  'Sexual Violence',
  'Sexual Violence/Exploitation'
];

let _engine;

let SchoolStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _schools;
  },

  getSchool: function(rcdts) {
    return _schoolLookup[rcdts];
  },

  getEngine: function() {
    return _engine;
  },

  getProgramTypes: function() {
    return _programTypes;
  },

  getProgram: function(rcdts, programId) {
    const school = this.getSchool(rcdts);
    return school.properties.programs.filter(program => program._id == programId)[0];
  },

  emitChange: function(method) {
    this.emit(CHANGE_EVENT, method);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  emitReceiveProgram: function(program, method) {
    this.emit(RECEIVE_PROGRAM_EVENT, program, method);
  },

  addReceiveProgramListener: function(callback) {
    this.on(RECEIVE_PROGRAM_EVENT, callback);
  },

  removeReceiveProgramListener: function(callback) {
    this.removeListener(RECEIVE_PROGRAM_NOTE_EVENT, callback);
  },

  emitReceiveProgramNote: function(program, note, method) {
    this.emit(RECEIVE_PROGRAM_NOTE_EVENT, program, note, method);
  },

  addReceiveProgramNoteListener: function(callback) {
    this.on(RECEIVE_PROGRAM_NOTE_EVENT, callback);
  },

  removeReceiveProgramNoteListener: function(callback) {
    this.removeListener(RECEIVE_PROGRAM_NOTE_EVENT, callback);
  },

  emitZoomToMarker: function(school) {
    this.emit(ZOOM_TO_MARKER_EVENT, school);
  },

  addZoomToMarkerListener: function(callback) {
    this.addListener(ZOOM_TO_MARKER_EVENT, callback);
  },

  removeZoomToMarkerListener: function(callback) {
    this.removeListener(ZOOM_TO_MARKER_EVENT, callback);
  },

  _createEngine: function(schools) {
    if (typeof Bloodhound != 'undefined') {
      return new Bloodhound({
        local: _schools,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        datumTokenizer: school => Bloodhound.tokenizers.whitespace(school.properties.FacilityName),
        identify: school => school.properties.rcdts
      });
    }

    return undefined;
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    const action = payload.action;

    switch(action.actionType) {
      case LearningCollaborativeConstants.SCHOOLS_SET:
        _schools = action.schools;
        _schoolLookup = _schools.reduce((lookup, school) => {
           lookup[school.properties.rcdts] = school;
           return lookup;
        }, {});
        _engine = SchoolStore._createEngine(_schools);
        SchoolStore.emitChange('set');
        break;
      case LearningCollaborativeConstants.RECEIVE_SCHOOL:
        if (action.method == 'create') {
          let schoolToAdd = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [action.school.lng, action.school.lat]
            },
            properties: action.school
          };
          _schools.push(schoolToAdd);
          _schoolLookup[schoolToAdd.properties.rcdts] = schoolToAdd;
        }
        else if (action.method == 'update') {
          _schoolLookup[action.school.rcdts].properties = action.school;
          _schoolLookup[action.school.rcdts].geometry.coordinates = [
            action.school.lng,
            action.school.lat
          ];
        }

        _engine = SchoolStore._createEngine(_schools);
        SchoolStore.emitChange(action.method);
        break;
      case LearningCollaborativeConstants.RECEIVE_PROGRAM:
        SchoolStore.emitReceiveProgram(action.program, action.method);
        break;
      case LearningCollaborativeConstants.RECEIVE_PROGRAM_NOTE:
        SchoolStore.emitReceiveProgramNote(action.program, action.note, action.method);
        break;
      case LearningCollaborativeConstants.ZOOM_TO_MARKER:
        SchoolStore.emitZoomToMarker(action.school);
        break;
    }

    return true;
  })
});

export default SchoolStore;
