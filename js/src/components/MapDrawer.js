import React from 'react';

import SchoolDetail from './SchoolDetail';
import SchoolSearch from './SchoolSearch';
import CreateProgram from './CreateProgram';
import ContactInfo from './ContactInfo';

const MapDrawer = React.createClass({
  render: function() {
    return (
      <div className="map-drawer">
        <SchoolSearch engine={this.props.engine} handleSelectSchool={this.props.handleSelectSchool} />
        <SchoolDetail school={this.props.school} agencyLookup={this.props.agencyLookup} />
        <CreateProgram school={this.props.school}
                       agencies={this.props.agencies}
                       agencyLookup={this.props.agencyLookup}
                       programTypes={this.props.programTypes}
                       createProgram={this.props.createProgram} />
        <ContactInfo contactEmail={this.props.contactEmail} />                 
      </div>
    );
  }
});

export default MapDrawer;
