import React from 'react';

import SchoolDetail from './SchoolDetail';

const MapDrawer = React.createClass({
  render: function() {
    return (
      <div className="map-drawer">
        <SchoolDetail school={this.props.school} />
      </div>
    );
  }
});

export default MapDrawer;
