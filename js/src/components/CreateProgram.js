import React from 'react';

const CreateProgram = React.createClass({
  getInitialState: function() {
    return {
      agency: undefined,
      ageGroup: undefined,
      programType: undefined
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

    let programTypeOptions = [
      <option value="" key=""></option>
    ].concat(this.props.programTypes.map(programType => {
      return <option value={programType} key={programType}>{programType}</option>;
    }));

    return (
      <form className="create-program" onSubmit={this.handleSubmit}>
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
        <button type="submit" className="btn btn-primary" disabled={this.buttonDisabled()}>Add Program</button>
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

  handleSubmit: function(event) {
    event.preventDefault();

    let agency = this.state.agency;
    let programType = this.state.programType;

    this.props.createProgram(this.props.school, agency, this.state.ageGroup, programType);

    // Try to reset the form values.  For some reason, the selects aren't
    // getting reset.
    this.setState({
      agency: undefined,
      ageGroup: undefined,
      programType: undefined
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

export default CreateProgram;
