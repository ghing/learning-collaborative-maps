import React from 'react';

import CreateProgram from './CreateProgram';
import SchoolPrograms from './SchoolPrograms';

const SchoolDetail = React.createClass({
  getInitialState: function() {
    return {
      addingProgram: false
    };
  },

  render: function() {
    if (!this.props.school) {
      return false;
    }

    let schoolProps = this.props.school.properties;
    let addProgramButton = false;
    let createProgram = false;
    let schoolPrograms = false;

    if (this.state.addingProgram) {
      createProgram = <CreateProgram school={this.props.school}
                         agencies={this.props.agencies}
                         agencyLookup={this.props.agencyLookup}
                         programTypes={this.props.programTypes}
                         createProgram={this._handleCreateProgram}
                         cancel={this._handleCancelCreateProgram} />;
    }
    else {
      schoolPrograms = <SchoolPrograms school={this.props.school} agencyLookup={this.props.agencyLookup} />
      addProgramButton = <button className="btn btn-primary" onClick={this._handleClickAddProgram}>Add Program</button>;
    }

    return (
      <div className="school-detail">
        <h2>{schoolProps.FacilityName}</h2>
        {schoolPrograms}
        {createProgram}
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
