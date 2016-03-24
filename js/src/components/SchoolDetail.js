import React from 'react';

const SchoolDetail = React.createClass({
  render: function() {
    if (!this.props.school) {
      return false;
    }

    let schoolProps = this.props.school.properties;

    return (
      <div className="school-detail">
        <h2>{schoolProps.FacilityName}</h2>
      </div>
    );
  }
});

export default SchoolDetail;
