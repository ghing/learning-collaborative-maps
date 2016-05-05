import React from 'react';

import CreateProgram from './CreateProgram';
import EditProgram from './EditProgram';
import SchoolPrograms from './SchoolPrograms';

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
      createProgram = <CreateProgram school={this.props.school}
                         agencies={this.props.agencies}
                         agencyLookup={this.props.agencyLookup}
                         programTypes={this.props.programTypes}
                         createProgram={this._handleCreateProgram}
                         cancel={this._handleCancelCreateProgram} />;
    }
    else if (this.state.editingProgram) {
      editProgram = <EditProgram school={this.props.school}
                                 program={this.state.program}
                                 agencies={this.props.agencies}
                                 agencyLookup={this.props.agencyLookup}
                                 programTypes={this.props.programTypes}
                                 updateProgram={this._handleUpdateProgram}
                                 cancel={this._handleCancelEditProgram} />;
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

  _handleUpdateProgram: function(program) {

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
