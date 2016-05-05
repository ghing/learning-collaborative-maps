import React from 'react';

import {agencyIdFromUrl} from "../utils";

const EditProgram = React.createClass({
  getInitialState: function() {
    // Get state from this.props.program
    // I believe React docs say setting state from props is
    // an anti-pattern (with some exceptions).  I can't think
    // of a better way.  Maybe this is an exceptional case
    console.log(agencyIdFromUrl);
    let agencyId = agencyIdFromUrl(this.props.program.agency);
    let initialState = {
      agency: this.props.agencyLookup[agencyId],
      ageGroup: this.props.program.age_group,
      programType: this.props.program.program_type,
      dates: this.props.program.dates,
    };

    if (this.props.program.notes && this.props.program.notes.length) {
      initialState.notes = this.props.program.notes[0].text;
    }

    return initialState;
  },

  render: function() {
    let agencyOptions = [
      <option value="" key=""></option>
    ].concat(this.props.agencies.map(function(agency) {
      return <option value={agency.properties.slug} key={agency.properties.slug}>{agency.properties.agency}</option>;
    }));

    let programTypeOptions = [
      <option value="" key=""></option>
    ].concat(this.props.programTypes.map(programType => {
      return <option value={programType} key={programType}>{programType}</option>;
    }));

    return (
      <form className="edit-program" onSubmit={this.handleSubmit}>
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
          <select className="form-control" id="program-type" value={this.state.programType ? this.state.programType : ''} onChange={this.handleChangeProgramType} ref="programType">
            {programTypeOptions}
          </select>
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
        <button type="submit" className="btn btn-primary" disabled={this.buttonDisabled()}>Update Program</button>
        <button type="button" className="btn btn-secondary" onClick={this.props.cancel}>Cancel</button>
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

  handleChangeProgramType: function(event) {
    this.setState({
      programType: event.target.value
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

  handleSubmit: function(evt) {
    evt.preventDefault();
    // TODO: Fire action to update program
    // BOOKMARK
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

export default EditProgram;
