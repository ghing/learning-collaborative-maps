import React from 'react';

const SchoolPrograms = React.createClass({
  render: function() {
    let schoolProps = this.props.school.properties;

    if (!schoolProps.programs || !schoolProps.programs.length) {
      return false;
    }

    let programEls = schoolProps.programs.map(program => {
      let agencyBits = program.agency.split('/');
      let agencyId = agencyBits[agencyBits.length - 1];
      let agency = this.props.agencyLookup[agencyId];
      let programText = agency.properties.agency;
      let programBits = [agency.properties.agency];
      if (program.program_type) {
        programText += " - " + program.program_type;
        programBits.push(program.program_type);
      }
      if (program.age_group) {
        programText += " (" + program.age_group + ")";
        programBits.push(program.age_group);
      }

      return <li key={programBits.join('-')}>{programText}</li>;
    });

    return (
      <div className="school-programs">
        <h3>Programs</h3>
        <ul>
          {programEls}
        </ul>
      </div>
    );
  }
});

export default SchoolPrograms;
