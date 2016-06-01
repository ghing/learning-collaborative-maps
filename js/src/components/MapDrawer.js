import React from 'react';

import SchoolDetail from './SchoolDetail';
import SchoolSearch from './SchoolSearch';
import ContactInfo from './ContactInfo';

const MapDrawer = React.createClass({
  render: function() {
    return (
      <div className="map-drawer">
        <SchoolSearch engine={this.props.engine} handleSelectSchool={this.props.handleSelectSchool} />
        <SchoolDetail mode={this.props.mode}
                      school={this.props.school}
                      program={this.props.program}
                      agencies={this.props.agencies}
                      agencyLookup={this.props.agencyLookup}
                      programTypes={this.props.programTypes}
                      createProgram={this.props.createProgram}
                      updateProgram={this.props.updateProgram} />
        <ContactInfo contactEmail={this.props.contactEmail} />                 
      </div>
    );
  }
});

export default MapDrawer;
