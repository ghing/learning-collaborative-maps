import React from 'react';

import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';
import ProgramForm from './ProgramForm';
import SchoolPrograms from './SchoolPrograms';
import {agencyIdFromUrl} from "../utils";

const SchoolDetail = React.createClass({
  render: function() {
    if (!this.props.school) {
      return false;
    }

    let schoolProps = this.props.school.properties;
    let addProgramButton = false;
    let createProgram = false;
    let editProgram = false;
    let schoolPrograms = false;

    if (this.props.mode == LearningCollaborativeConstants.ADD_PROGRAM_MODE) {
      createProgram = <ProgramForm school={this.props.school}
                         agencies={this.props.agencies}
                         agencyLookup={this.props.agencyLookup}
                         programTypes={this.props.programTypes}
                         handleSubmit={this._handleCreateProgram}
                         handleCancel={this._handleCancelCreateProgram}
                         submitLabel="Add Program" />;
    }
    else if (this.props.mode == LearningCollaborativeConstants.EDIT_PROGRAM_MODE) {
      let agencyId = agencyIdFromUrl(this.props.program.agency);
      let initialNotes;
      
      if (this.props.program.notes && this.props.program.notes.length) {
        initialNotes = this.props.program.notes[0].text;  
      }

      editProgram = <ProgramForm school={this.props.school}
                                 agencies={this.props.agencies}
                                 agencyLookup={this.props.agencyLookup}
                                 programTypes={this.props.programTypes}
                                 initialAgency={this.props.agencyLookup[agencyId]}
                                 initialAgeGroup={this.props.program.age_group}
                                 initialProgramType={this.props.program.program_type}
                                 initialDates={this.props.program.dates}
                                 initialNotes={initialNotes}
                                 handleSubmit={this._handleUpdateProgram}
                                 handleCancel={this._handleCancelEditProgram}
                                 submitLabel="Update Program" />;
    }
    else {
      schoolPrograms = <SchoolPrograms school={this.props.school}
                                       agencyLookup={this.props.agencyLookup}
                                       editProgram={this._handleEditProgram} />
      addProgramButton = <button className="btn btn-primary" onClick={this._handleClickAddProgram}>Add Program</button>;
    }

    return (
      <div className="school-detail">
        <h2>{schoolProps.FacilityName}</h2>
        {schoolPrograms}
        {createProgram}
        {editProgram}
        {addProgramButton}
      </div>
    );
  },

  _handleClickAddProgram: function(evt) {
    evt.preventDefault();
    LearningCollaborativeActions.showAddProgramForm(this.props.school);
  },

  _handleEditProgram: function(program) {
    LearningCollaborativeActions.showEditProgramForm(this.props.school, program);
  },

  _handleUpdateProgram: function(school, agency, ageGroup, programType, dates, notes) {
    this.props.updateProgram(
      school,
      this.props.program,
      agency,
      ageGroup,
      programType,
      dates,
      notes
    );
  },

  _handleCancelEditProgram: function(evt) {
    evt.preventDefault();
    LearningCollaborativeActions.showSchoolDetail(this.props.school);
  },

  _handleCancelCreateProgram: function(evt) {
    evt.preventDefault();
    LearningCollaborativeActions.showSchoolDetail(this.props.school);
  },

  _handleCreateProgram: function(school, agency, ageGroup, programType, dates, notes) {
    this.props.createProgram(
      school,
      agency,
      ageGroup,
      programType,
      dates,
      notes
    );
  }
});

export default SchoolDetail;
