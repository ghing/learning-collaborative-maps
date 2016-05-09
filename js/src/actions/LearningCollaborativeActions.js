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

  createProgram: function(school, agency, ageGroup, programType, dates, notes) {
    AppDispatcher.handleViewAction({
      actionType: LearningCollaborativeConstants.CREATE_PROGRAM,
      school: school,
      agency: agency,
      ageGroup: ageGroup,
      programType: programType
    });
    LearningCollaborativeApi.createProgram(school, agency, ageGroup, programType, dates).then(program => {
      LearningCollaborativeServerActions.receiveProgram(program);
      if (notes) {
        LearningCollaborativeApi.createProgramNote(school, program, notes).then(note => {
          LearningCollaborativeServerActions.receiveProgramNote(program, note);
        });
      }
    });
  },

  updateProgram: function(school, program, agency, ageGroup, programType, dates, notes) {
    LearningCollaborativeApi.updateProgram(school, program, agency, ageGroup, programType, dates).then(program => {
      LearningCollaborativeServerActions.receiveProgram(program);
      if (notes) {
         // Determine if note already exists.
         if (program.notes && program.notes.length) {
           // If it does, update it
           let note = program.notes[0];
           note.text = notes;
           LearningCollaborativeApi.updateProgramNote(school, program, note).then(note => {
             LearningCollaborativeServerActions.receiveProgramNote(program, note);
           })
         }
         else {
           // If it doesn't, create it
           LearningCollaborativeApi.createProgramNote(school, program, notes).then(note => {
             LearningCollaborativeServerActions.receiveProgramNote(program, note);
           });
         }
      }
    });
  }
};

export default LearningCollaborativeActions;
