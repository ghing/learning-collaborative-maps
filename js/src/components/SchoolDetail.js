import React from 'react';

import SchoolPrograms from './SchoolPrograms';

const SchoolDetail = React.createClass({
  render: function() {
    if (!this.props.school) {
      return false;
    }

    let schoolProps = this.props.school.properties;

    return (
      <div className="school-detail">
        <h2>{schoolProps.FacilityName}</h2>
        <SchoolPrograms school={this.props.school} agencyLookup={this.props.agencyLookup} />
      </div>
    );
  }
});

export default SchoolDetail;
