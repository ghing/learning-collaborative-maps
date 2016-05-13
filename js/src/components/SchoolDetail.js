import React from 'react';

import ProgramForm from './ProgramForm';
import SchoolPrograms from './SchoolPrograms';
import {agencyIdFromUrl} from "../utils";

const SchoolDetail = React.createClass({
  getInitialState: function() {
    return {
      addingProgram: false,
      editingProgram: false
    };
  },

  render: function() {
    if (!this.props.school) {
      return false;
    }

    let schoolProps = this.props.school.properties;
    let addProgramButton = false;
    let createProgram = false;
    let editProgram = false;
    let schoolPrograms = false;

    if (this.state.addingProgram) {
      createProgram = <ProgramForm school={this.props.school}
                         agencies={this.props.agencies}
                         agencyLookup={this.props.agencyLookup}
                         programTypes={this.props.programTypes}
                         handleSubmit={this._handleCreateProgram}
                         handleCancel={this._handleCancelCreateProgram}
                         submitLabel="Add Program" />;
    }
    else if (this.state.editingProgram) {
      let agencyId = agencyIdFromUrl(this.state.program.agency);
      let initialNotes;
      
      if (this.state.program.notes && this.state.program.notes.length) {
        initialNotes = this.state.program.notes[0].text;  
      }

      editProgram = <ProgramForm school={this.props.school}
                                 agencies={this.props.agencies}
                                 agencyLookup={this.props.agencyLookup}
                                 programTypes={this.props.programTypes}
                                 initialAgency={this.props.agencyLookup[agencyId]}
                                 initialAgeGroup={this.state.program.age_group}
                                 initialProgramType={this.state.program.program_type}
                                 initialDates={this.state.program.dates}
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
    this.setState({
      addingProgram: true
    });
  },

  _handleEditProgram: function(program) {
    this.setState({
      editingProgram: true,
      program: program
    });
  },

  _handleUpdateProgram: function(school, agency, ageGroup, programType, dates, notes) {
    this.props.updateProgram(
      school,
      this.state.program,
      agency,
      ageGroup,
      programType,
      dates,
      notes
    );
    this.setState({
      editingProgram: false,
      program: undefined
    });
  },

  _handleCancelEditProgram: function(evt) {
    evt.preventDefault();
    this.setState({
      editingProgram: false,
      program: undefined
    });
  },

  _handleCancelCreateProgram: function(evt) {
    evt.preventDefault();
    this.setState({
      addingProgram: false
    });
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
    this.setState({
      addingProgram: false
    });
  }
});

export default SchoolDetail;
