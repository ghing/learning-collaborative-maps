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

    let options = this.props.agencies.map(function(agency) {
      return <option value={agency.properties.slug} key={agency.properties.slug}>{agency.properties.agency}</option>;
    });

    return (
      <form className="create-program" onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <label htmlFor="agency">Agency</label>
          <select className="form-control" id="agency" value={this.state.agency ? this.state.agency.properties.slug : undefined} onChange={this.handleChangeAgency}>
            {options}
          </select>
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="age-group">Age Group</label>
          <input type="text" value={this.state.ageGroup} onChange={this.handleChangeAgeGroup} />
        </fieldset>
        <button type="submit" className="btn btn-primary" value="Add Program" disabled={this.buttonDisabled()} />
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

  handleSubmit: function(event) {
    event.preventDefault();
    this.props.createProgram(this.props.school, this.state.agency, this.state.ageGroup);
  },

  buttonDisabled: function() {
    return this.state.agency && this.state.ageGroup;
  }
});

export default CreateProgram;
