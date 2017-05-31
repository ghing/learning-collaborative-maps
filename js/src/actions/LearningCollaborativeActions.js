import { browserHistory } from 'react-router';

import AppDispatcher from '../dispatcher/AppDispatcher';
import LearningCollaborativeApi from '../utils/LearningCollaborativeApi';
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';
import LearningCollaborativeServerActions from './LearningCollaborativeServerActions';


const LearningCollaborativeActions = {
  setSchools: function(schools) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.SCHOOLS_SET,
      schools: schools
    });
  },

  setAgencies: function(agencies) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.AGENCIES_SET,
      agencies: agencies
    });
  },

  showSchoolDetail: function(school) {
    browserHistory.push('/schools/' + school.properties.rcdts);
  },

  zoomToMarker: function(school) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.ZOOM_TO_MARKER,
      school: school
    });
  },

  createAgency: function (
    slug,
    agency,
    catchmentArea,
    programType,
    officeLocation,
    lat,
    lng,
    markerColor
  ) {
    LearningCollaborativeApi.createAgency(
      slug,
      agency,
      catchmentArea,
      programType,
      officeLocation,
      lat,
      lng,
      markerColor
    ).then(agency => {
      LearningCollaborativeServerActions.receiveAgency(agency, 'create');
    });
  },

  updateAgency: function(
    slug,
    agency,
    catchmentArea,
    programType,
    officeLocation,
    lat,
    lng,
    markerColor
  ) {
    LearningCollaborativeApi.updateAgency(
      slug,
      agency,
      catchmentArea,
      programType,
      officeLocation,
      lat,
      lng,
      markerColor
    ).then(agency => {
      LearningCollaborativeServerActions.receiveAgency(agency, 'update');
    });
  },

  createProgram: function(school, agency, ageGroup, programType, dates, notes) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.CREATE_PROGRAM,
      school: school,
      agency: agency,
      ageGroup: ageGroup,
      programType: programType
    });
    LearningCollaborativeApi.createProgram(school, agency, ageGroup, programType, dates).then(program => {
      LearningCollaborativeServerActions.receiveProgram(program, 'create');
      if (notes) {
        LearningCollaborativeApi.createProgramNote(school, program, notes).then(note => {
          LearningCollaborativeServerActions.receiveProgramNote(program, note, 'create');
        });
      }
    });
  },

  updateProgram: function(school, program, agency, ageGroup, programType, dates, notes) {
    LearningCollaborativeApi.updateProgram(school, program, agency, ageGroup, programType, dates).then(program => {
      LearningCollaborativeServerActions.receiveProgram(program, 'update');
      if (notes) {
         // Determine if note already exists.
         if (program.notes && program.notes.length) {
           // If it does, update it
           let note = program.notes[0];
           note.text = notes;
           LearningCollaborativeApi.updateProgramNote(school, program, note).then(note => {
             LearningCollaborativeServerActions.receiveProgramNote(program, note, 'update');
           });
         }
         else {
           // If it doesn't, create it
           LearningCollaborativeApi.createProgramNote(school, program, notes).then(note => {
             LearningCollaborativeServerActions.receiveProgramNote(program, note, 'create');
           });
         }
      }
    });
  },

  createSchool: function(rcdts, name, address, city, zip, gradeServed, lat, lng) {
    LearningCollaborativeApi.createSchool(rcdts, name, address, city, zip, gradeServed, lat, lng).then(school => {
      LearningCollaborativeServerActions.receiveSchool(school, 'create');
    });
  },

  updateSchool: function(rcdts, name, address, city, zip, gradeServed, lat, lng) {
    LearningCollaborativeApi.updateSchool(rcdts, name, address, city, zip, gradeServed, lat, lng).then(school => {
      LearningCollaborativeServerActions.receiveSchool(school, 'update');
    });
  },

  requestLoginToken: function(user) {
    LearningCollaborativeApi.requestLoginToken(user).then(user => {
      LearningCollaborativeServerActions.receiveLoginUser(user);
    });
  }
};

export default LearningCollaborativeActions;
