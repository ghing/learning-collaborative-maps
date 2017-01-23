import React from 'react';

import SchoolSearch from './SchoolSearch';
import ContactInfo from './ContactInfo';

class MapDrawer extends React.Component {
  render() {
    return (
      <div className="map-drawer">
        <SchoolSearch engine={this.props.engine} handleSelectSchool={this.props.handleSelectSchool} />
        {this.props.children}
        <ContactInfo contactEmail={this.props.contactEmail} />                 
      </div>
    );
  }
}

export default MapDrawer;
