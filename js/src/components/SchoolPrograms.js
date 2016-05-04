import React from 'react';

import SchoolProgram from './SchoolProgram';

const SchoolPrograms = React.createClass({
  render: function() {
    let schoolProps = this.props.school.properties;

    if (!schoolProps.programs || !schoolProps.programs.length) {
      return false;
    }

    let programEls = schoolProps.programs.map(program => {
      return <SchoolProgram key={program._id}
                            program={program}
                            agencyLookup={this.props.agencyLookup} />;
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
