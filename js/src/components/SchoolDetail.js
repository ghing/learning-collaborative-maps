import React from 'react';

import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import ProgramForm from './ProgramForm';
import SchoolPrograms from './SchoolPrograms';

class SchoolDetail extends React.Component {
  constructor(props) {
    super(props);

    this._handleClickAddProgram = this._handleClickAddProgram.bind(this);
    this._handleCancelProgram = this._handleCancelProgram.bind(this);
    this._handleUpdateProgram = this._handleUpdateProgram.bind(this);
    this._handleCreateProgram = this._handleCreateProgram.bind(this);
  }

  render() {
    if (!this.props.school) {
      return false;
    }

    return (
      <div className="school-detail">
        <h2>{this.props.school.properties.FacilityName}</h2>
        {this._getChildren(this.props)}
      </div>
    );
  }

  _getChildren(props) {
    if (props.children) {
      // There are children of this component. They are set by the router and
      // will be a form to either add or edit a program.
      const programFormProps = this._getProgramFormProps(props);

      return React.Children.map(props.children, child => React.cloneElement(child, programFormProps));
    }
    else {
      // props.children is not set.  Just show a list of existing programs.
      return [
        <SchoolPrograms school={this.props.school}
          agencyLookup={this.props.agencyLookup}
          key="programs" />,
        <button className="btn btn-primary" onClick={this._handleClickAddProgram} key="add-program-button">Add Program</button>
      ];
    }
  }

  _getProgramFormProps(props) {
    return {
      school: props.school,
      program: props.program,
      agencies: props.agencies,
      agencyLookup: props.agencyLookup,
      programTypes: props.programTypes,
      handleCreateProgram: this._handleCreateProgram,
      handleUpdateProgram: this._handleUpdateProgram,
      handleCancel: this._handleCancelProgram
    };
  }

  _handleClickAddProgram(evt) {
    evt.preventDefault();
    this.props.router.push(`/schools/${this.props.school.properties.rcdts}/programs/add`)
  }

  _handleUpdateProgram(school, agency, ageGroup, programType, dates, notes) {
    this.props.updateProgram(
      school,
      this.props.program,
      agency,
      ageGroup,
      programType,
      dates,
      notes
    );
  }

  _handleCancelProgram(evt) {
    evt.preventDefault();
    LearningCollaborativeActions.showSchoolDetail(this.props.school);
  }

  _handleCreateProgram(school, agency, ageGroup, programType, dates, notes) {
    this.props.createProgram(
      school,
      agency,
      ageGroup,
      programType,
      dates,
      notes
    );
  }
}

export default SchoolDetail;
