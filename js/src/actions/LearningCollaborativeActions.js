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
  }
};

export default LearningCollaborativeActions;
