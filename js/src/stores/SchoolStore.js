import assign from 'object-assign';
import {EventEmitter} from 'events';
import Bloodhound from 'typeahead.js/dist/bloodhound';

import AppDispatcher from '../dispatcher/AppDispatcher';
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';

const CHANGE_EVENT = 'change';
const RECEIVE_PROGRAM_EVENT = 'receive:program';
const RECEIVE_PROGRAM_NOTE_EVENT = 'receive:programNote';

let _schools = []; // Collection of school items
let _schoolLookup = {};
let _programTypes = [
  'Dating/Partner Violence',
  'Dating/Partner Violence/Bullying',
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

  getEngine: function() {
    return _engine;
  },

  getProgramTypes: function() {
    return _programTypes;
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

  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;

    switch(action.actionType) {
      case LearningCollaborativeConstants.SCHOOLS_SET:
        _schools = action.schools;
        _schoolLookup = _schools.reduce((lookup, school) => {
           lookup[school.properties.rcdts] = school;
           return lookup;
        }, {});
        _engine = new Bloodhound({
          local: _schools,
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          datumTokenizer: school => Bloodhound.tokenizers.whitespace(school.properties.FacilityName),
          identify: school => school.properties.rcdts
        });
        SchoolStore.emitChange();
        break;
      case LearningCollaborativeConstants.RECEIVE_PROGRAM:
        SchoolStore.emitReceiveProgram(action.program, action.method);
        break;
      case LearningCollaborativeConstants.RECEIVE_PROGRAM_NOTE:
        SchoolStore.emitReceiveProgramNote(action.program, action.note, action.method);
        break;
    }

    return true;
  })
});

export default SchoolStore;
