import React from 'react';

import {agencyIdFromUrl} from "../utils";

const SchoolProgram = React.createClass({
  getInitialState: function() {
    return {
      hovering: false
    };
  },

  render: function() {
    let program = this.props.program;
    let agencyId = agencyIdFromUrl(program.agency);
    let agency = this.props.agencyLookup[agencyId];
    let programText = agency.properties.agency;
    if (program.program_type) {
      programText += " - " + program.program_type;
    }
    if (program.age_group) {
      programText += " (" + program.age_group + ")";
    }
    if (program.dates) {
      programText += " - " + program.dates;
    }

    let editLink = false;
    if (this.state.hovering) {
      editLink = <a href="#" className="edit-link" onClick={this._handleClickEdit}>Edit</a>;
    }

    return (
      <li onMouseEnter={this._handleMouseEnter} onMouseLeave={this._handleMouseLeave}>
        {programText}
        {editLink}
      </li>
    );
  },

  _handleMouseEnter: function(evt) {
    this.setState({
      hovering: true
    });
  },

  _handleMouseLeave: function(evt) {
    this.setState({
      hovering: false
    });
  },

  _handleClickEdit: function(evt) {
    evt.preventDefault();
    this.props.editProgram(this.props.program);
  }
});

export default SchoolProgram;
