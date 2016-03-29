import React from 'react';

const CreateProgram = React.createClass({
  getInitialState: function() {
    return {
      agency: null,
      ageGroup: null
    };
  },

  render: function() {
    if (!this.props.school) {
      return false;
    }

    if (!this.props.agencies.length) {
      return false;
    }

    let agencyOptions = this.props.agencies.map(function(agency) {
      return <option value={agency.properties.slug} key={agency.properties.slug}>{agency.properties.agency}</option>;
    });

    let programTypeOptions = this.props.programTypes.map(programType => {
      return <option value={programType} key={programType}>{programType}</option>;
    });

    return (
      <form className="create-program" onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <label htmlFor="agency">Agency</label>
          <select className="form-control" id="agency" value={this.state.agency ? this.state.agency.properties.slug : undefined} onChange={this.handleChangeAgency} ref="agency">
            {agencyOptions}
          </select>
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="age-group">Age Group</label>
          <input type="text" value={this.state.ageGroup} onChange={this.handleChangeAgeGroup} />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="program-type">Program Type</label>
          <select className="form-control" id="program-type" value={this.state.programType} onChange={this.handleChangeProgramType} ref="programType">
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
    if (!agency) {
      agency = this.props.agencyLookup[this.refs.agency.value];
    }

    let programType = this.state.programType;
    if (!programType) {
      programType = this.refs.programType.value;
    }

    this.props.createProgram(this.props.school, agency, this.state.ageGroup, programType);
  },

  buttonDisabled: function() {
    return this.state.agency && this.state.ageGroup;
  }
});

export default CreateProgram;
