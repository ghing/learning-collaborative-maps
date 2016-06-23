import React from 'react';

import {agencyIdFromUrl} from "../utils";

const SchoolProgram = React.createClass({
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

    return (
      <li className="school-program">
        {programText}
        <a href="#" className="edit-link" onClick={this._handleClickEdit}>Edit</a>
      </li>
    );
  },

  _handleClickEdit: function(evt) {
    evt.preventDefault();
    this.props.editProgram(this.props.program);
  }
});

export default SchoolProgram;
