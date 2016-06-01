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

  showSchoolDetail: function(school, zoomToMarker=false) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.SHOW_SCHOOL_DETAIL,
      school: school,
      zoomToMarker: zoomToMarker
    });
  },

  showAddProgramForm: function(school) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.SHOW_ADD_PROGRAM_FORM,
      school: school
    });
  },

  showEditProgramForm: function(school, program) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.SHOW_EDIT_PROGRAM_FORM,
      school: school,
      program: program
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
  }
};

export default LearningCollaborativeActions;
