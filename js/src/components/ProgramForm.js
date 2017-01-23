import React from 'react';

import SelectWithOther from './SelectWithOther';
import {agencyIdFromUrl} from "../utils";

class ProgramForm extends React.Component {
  constructor(props) {
    super(props);

    if (props.program) {
      // A program has been passed so we're editing a program rather than
      // adding one.  Set initial form values in the state
      const agencyId = agencyIdFromUrl(props.program.agency);

      let initialNotes;

      if (props.program.notes && props.program.notes.length) {
        initialNotes = props.program.notes[0].text;
      }

      this.state = {
        agency: props.agencyLookup[agencyId],
        ageGroup: props.program.age_group,
        programType: props.program.program_type,
        dates: props.program.dates,
        notes: initialNotes
      };
    }
    else {
      this.state = {};
    }

    this.handleChangeAgency = this.handleChangeAgency.bind(this);
    this.handleChangeAgeGroup = this.handleChangeAgeGroup.bind(this);
    this.handleChangeProgramType = this.handleChangeProgramType.bind(this);
    this.handleChangeDates = this.handleChangeDates.bind(this);
    this.handleChangeNotes = this.handleChangeNotes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
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

    const submitLabel = this.props.program ? "Update Program" : "Add Program";

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
                 value={this.state.ageGroup ? this.state.ageGroup : ''}
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
                 value={this.state.dates ? this.state.dates : ''}
                 onChange={this.handleChangeDates} />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor="program-notes">Notes</label>
          <textarea id="program-notes" className="form-control" value={this.state.notes} onChange={this.handleChangeNotes} ref="notes"></textarea>
        </fieldset>
        <button type="submit" className="btn btn-primary" disabled={this.buttonDisabled()}>{submitLabel}</button>
        <button type="button" className="btn btn-secondary" onClick={this.props.handleCancel}>Cancel</button>
      </form>
    );
  }

  handleChangeAgency(event) {
    let agencyId = event.target.value;

    this.setState({
      agency: this.props.agencyLookup[agencyId]
    });
  }

  handleChangeAgeGroup(event) {
    this.setState({
      ageGroup: event.target.value
    });
  }

  handleChangeProgramType(programType) {
    this.setState({
      programType: programType
    });
  }

  handleChangeDates(event) {
    this.setState({
      dates: event.target.value
    });
  }

  handleChangeNotes(event) {
    this.setState({
      notes: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const handleSubmit = this.props.program ? this.props.handleUpdateProgram : this.props.handleCreateProgram;

    handleSubmit(
      this.props.school,
      this.state.agency,
      this.state.ageGroup,
      this.state.programType,
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
  }

  buttonDisabled() {
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
}

export default ProgramForm;
