import React from 'react';

import SchoolDetail from './SchoolDetail';
import SchoolSearch from './SchoolSearch';

const MapDrawer = React.createClass({
  render: function() {
    return (
      <div className="map-drawer">
        <SchoolSearch engine={this.props.engine} handleSelectSchool={this.props.handleSelectSchool} />
        <SchoolDetail school={this.props.school} />
      </div>
    );
  }
});

export default MapDrawer;
