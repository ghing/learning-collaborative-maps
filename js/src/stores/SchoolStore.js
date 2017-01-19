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
const CHANGE_MODE_EVENT = 'change:mode';

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

let _engine, _mode, _selectedSchool, _selectedProgram;

let SchoolStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _schools;
  },

  getEngine: function() {
    return _engine;
  },

  getProgramTypes: function() {
    return _programTypes;
  },

  getSelectedSchool: function() {
    return _selectedSchool;
  },

  getSelectedProgram: function() {
    return _selectedProgram;
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

  emitChangeMode: function(mode, props) {
    this.emit(CHANGE_MODE_EVENT, mode, props);
  },

  addChangeModeListener: function(callback) {
    this.on(CHANGE_MODE_EVENT, callback);
  },

  removeChangeModeListener: function(callback) {
    this.removeListener(CHANGE_MODE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;

    switch(action.actionType) {
      case LearningCollaborativeConstants.SCHOOLS_SET:
        _schools = action.schools;
        _schoolLookup = _schools.reduce((lookup, school) => {
           lookup[school.properties.rcdts] = school;
           return lookup;
        }, {});
        if (typeof Bloodhound != 'undefined') {
          _engine = new Bloodhound({
            local: _schools,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            datumTokenizer: school => Bloodhound.tokenizers.whitespace(school.properties.FacilityName),
            identify: school => school.properties.rcdts
          });
        }
        SchoolStore.emitChange();
        break;
      case LearningCollaborativeConstants.RECEIVE_PROGRAM:
        SchoolStore.emitReceiveProgram(action.program, action.method);
        break;
      case LearningCollaborativeConstants.RECEIVE_PROGRAM_NOTE:
        SchoolStore.emitReceiveProgramNote(action.program, action.note, action.method);
        break;
      case LearningCollaborativeConstants.SHOW_SCHOOL_DETAIL:
        _selectedSchool = action.school;
        SchoolStore.emitChangeMode(LearningCollaborativeConstants.SCHOOL_DETAIL_MODE, {
          zoomToMarker: action.zoomToMarker
        });
        break;
      case LearningCollaborativeConstants.SHOW_ADD_PROGRAM_FORM:
        _selectedSchool = action.school;
        SchoolStore.emitChangeMode(LearningCollaborativeConstants.ADD_PROGRAM_MODE);
        break;
      case LearningCollaborativeConstants.SHOW_EDIT_PROGRAM_FORM:
        _selectedSchool = action.school;
        _selectedProgram = action.program;
        SchoolStore.emitChangeMode(LearningCollaborativeConstants.EDIT_PROGRAM_MODE);
        break;
    }

    return true;
  })
});

export default SchoolStore;
