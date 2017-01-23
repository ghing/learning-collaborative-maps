import React from 'react';

import SchoolProgram from './SchoolProgram';

class SchoolPrograms extends React.Component {
  render() {
    let schoolProps = this.props.school.properties;

    if (!schoolProps.programs || !schoolProps.programs.length) {
      return false;
    }

    let programEls = schoolProps.programs.map(program => {
      return <SchoolProgram key={program._id}
                            school={this.props.school}
                            program={program}
                            agencyLookup={this.props.agencyLookup}
                            editProgram={this.props.editProgram} />;
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
}

export default SchoolPrograms;
