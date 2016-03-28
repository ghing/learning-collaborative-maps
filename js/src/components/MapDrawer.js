import React from 'react';

import SchoolDetail from './SchoolDetail';
import SchoolSearch from './SchoolSearch';
import CreateProgram from './CreateProgram';

const MapDrawer = React.createClass({
  render: function() {
    return (
      <div className="map-drawer">
        <SchoolSearch engine={this.props.engine} handleSelectSchool={this.props.handleSelectSchool} />
        <SchoolDetail school={this.props.school} />
        <CreateProgram school={this.props.school} agencies={this.props.agencies} agencyLookup={this.props.agencyLookup} />
      </div>
    );
  }
});

export default MapDrawer;
