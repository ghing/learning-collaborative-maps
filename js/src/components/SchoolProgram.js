import React from 'react';

const SchoolProgram = React.createClass({
  render: function() {
    let program = this.props.program;
    let agencyBits = program.agency.split('/');
    let agencyId = agencyBits[agencyBits.length - 1];
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

    return <li>{programText}</li>;
  }
});

export default SchoolProgram;
