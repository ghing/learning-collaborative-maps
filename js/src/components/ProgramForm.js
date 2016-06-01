import React from 'react';

import SelectWithOther from './SelectWithOther';

const ProgramForm = React.createClass({
  getInitialState: function() {
    return {
      agency: this.props.initialAgency,
      ageGroup: this.props.initialAgeGroup,
      programType: this.props.initialProgramType,
      dates: this.props.initialDates,
      notes: this.props.initialNotes
    };
  },

  render: function() {
    if (!this.props.school) {
      return false;
    }

    if (!this.props.agencies.length) {
      return false;
    }

    let agencyOptions = [
      <option value="" key=""></option>
    ].concat(this.props.agencies.map(function(agency) {
      return <option value={agency.properties.slug} key={agency.properties.slug}>{agency.properties.agency}</option>;
    }));

    return (
      <form className="program-form" onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <label htmlFor="agency">Agency</label>
          <select className="form-control" id="agency" value={this.state.agency ? this.state.agency.properties.slug : ''} onChange={this.handleChangeAgency} ref="agency">
            {agencyOptions}
          </select>
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="age-group">Age Group</label>
          <input type="text"
                 id="age-group"
                 className="form-control"
                 placeholder="Example: 6th Grade, Grades 9-12"
                 value={this.state.ageGroup}
                 onChange={this.handleChangeAgeGroup} />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="program-type">Program Type</label>
          <SelectWithOther id="program-type"
            className="select-program-type"
            selectClassName="form-control"
            inputClassName="form-control other-input"
            options={this.props.programTypes}
            value={this.state.programType ? this.state.programType : ''}
            onChange={this.handleChangeProgramType} />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="dates">Dates</label>
          <input type="text"
                 id="dates"
                 className="form-control"
                 value={this.state.dates}
                 onChange={this.handleChangeDates} />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="program-notes">Notes</label>
          <textarea id="program-notes" className="form-control" value={this.state.notes} onChange={this.handleChangeNotes} ref="notes"></textarea>
        </fieldset>
        <button type="submit" className="btn btn-primary" disabled={this.buttonDisabled()}>{this.props.submitLabel}</button>
        <button type="button" className="btn btn-secondary" onClick={this.props.handleCancel}>Cancel</button>
      </form>
    );
  },

  handleChangeAgency: function(event) {
    let agencyId = event.target.value;

    this.setState({
      agency: this.props.agencyLookup[agencyId]
    });
  },

  handleChangeAgeGroup: function(event) {
    this.setState({
      ageGroup: event.target.value
    });
  },

  handleChangeProgramType: function(programType) {
    console.log(programType);
    this.setState({
      programType: programType
    });
  },

  handleChangeDates: function(event) {
    this.setState({
      dates: event.target.value
    });
  },

  handleChangeNotes: function(event) {
    this.setState({
      notes: event.target.value
    });
  },

  handleSubmit: function(event) {
    event.preventDefault();

    let agency = this.state.agency;
    let programType = this.state.programType;

    this.props.handleSubmit(
      this.props.school,
      agency,
      this.state.ageGroup,
      programType,
      this.state.dates,
      this.state.notes
    );

    this.setState({
      agency: undefined,
      ageGroup: undefined,
      programType: undefined,
      dates: undefined,
      notes: ''
    });
  },

  buttonDisabled: function() {
    if (!this.state.agency) {
      return true;
    }

    if (!this.state.ageGroup) {
      return true;
    }

    if (!this.state.programType) {
      return true;
    }

    return false;
  }
});

export default ProgramForm;
