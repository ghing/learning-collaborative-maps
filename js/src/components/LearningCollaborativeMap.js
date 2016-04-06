import assign from 'object-assign';
import L from 'leaflet';
import React from 'react';

import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import SchoolStore from '../stores/SchoolStore';
import AgencyStore from '../stores/AgencyStore';

import MapDrawer from './MapDrawer';

function agencySlugFromUrl(urlPath) {
  let pathBits = urlPath.split('/');
  return pathBits[pathBits.length - 1];
}

function distinctProgramAgencies(programs) {
  let agencySet = new Set();
  programs.forEach(program => {
    let agencySlug = agencySlugFromUrl(program.agency);
    agencySet.add(agencySlug);
  });
  // Convert set to list
  return [...agencySet];
}

const LearningCollaborativeMap = React.createClass({
  getInitialState: function() {
    return {
      schools: SchoolStore.getAll(),
      agencies: AgencyStore.getAll(),
      agencyLookup: AgencyStore.getLookup(),
      agencyColorScale: AgencyStore.getColorScale()
    };
  },

  getDefaultProps: function() {
    return {
      center: [41.881832, -87.623177],
      initialZoom: 13,
      markerOptions: {
        radius: 6,
        fillColor: "#bdbdbd",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      },
      multipleAgencyFillColor: 'black'
    }
  },

  render: function() {
    return (
      <div className="app-container">
        <div ref="mapContainer" className="map-container"></div>
        <MapDrawer school={this.state.selectedSchool}
                   engine={SchoolStore.getEngine()}
                   handleSelectSchool={this._handleSelectSchool}
                   agencies={this.state.agencies}
                   agencyLookup={this.state.agencyLookup}
                   programTypes={SchoolStore.getProgramTypes()}
                   createProgram={LearningCollaborativeActions.createProgram} />
      </div>
    );
  },

  componentDidMount: function() {
    SchoolStore.addChangeListener(this._onChange);
    SchoolStore.addReceiveProgramListener(this._onReceiveProgram);
    AgencyStore.addChangeListener(this._onChange);

    this.setState({
      map: this._initializeMap()
    });
  },

  componentWillUnmount: function() {
    SchoolStore.removeChangeListener(this._onChange);
    SchoolStore.removeReceiveProgramListener(this._onReceiveProgram);
    AgencyStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function(prevProps, prevState) {
    // HACK: Always redraw the marker, to detect possible color changes
    // based on a school's programs.  If we want to redraw only if the
    // programs change, we should represent the selected school using
    // something like Immutable.js
    if (this.state.selectedSchool) {
      let schoolProps = this.state.selectedSchool.properties;
      let programs = this.state.selectedSchool.properties.programs;
      if (programs && programs.length) {
        let marker = this.state.schoolMarkerLookup[schoolProps.rcdts];
        marker.setStyle(this._styleSchoolMarker(this.state.selectedSchool));
      }
    }
  },

  _initializeMap: function() {
    let map = L.map(this.refs.mapContainer, {
        zoomControl: false
      })
      .setView(this.props.center, this.props.initialZoom);
    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
  },

  _styleSchoolMarker: function(feature) {
    let markerOptions = assign({}, this.props.markerOptions);
    let programs = feature.properties.programs;

    if (programs && programs.length) {
      let agencies = distinctProgramAgencies(programs);

      if (agencies.length == 1) {
        markerOptions.fillColor = AgencyStore.getColorScale()(agencies[0]);
      }
      else {
        markerOptions.fillColor = this.props.multipleAgencyFillColor;
      }
    }
    return markerOptions;
  },

  _getSchoolMarkers: function(schools) {
    let component = this;

    let markerLookup = {};
    let schoolMarkers = L.geoJson(schools, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {});
      },
      style: component._styleSchoolMarker,
      onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.FacilityName, {
          // Move the popup arrow higher above the default.
          // Otherwise you can't click on the marker.
          offset: [0, 0]
        });
        layer.on('mouseover', function (e) {
            this.openPopup();
        });
        layer.on('mouseout', function (e) {
            this.closePopup();
        });
        layer.on('click', function(e) {
          component._handleClickSchoolMarker(feature);
        });
        markerLookup[feature.properties.rcdts] = layer;
      }
    });

    return [schoolMarkers, markerLookup];
  },

  _onChange: function() {
    let schools = SchoolStore.getAll();
    let map = this.state.map;
    let [schoolMarkers, markerLookup] = this._getSchoolMarkers(schools);
    schoolMarkers.addTo(map);
    map.fitBounds(schoolMarkers.getBounds());

    this.setState({
      schools: schools,
      agencies: AgencyStore.getAll(),
      agencyLookup: AgencyStore.getLookup(),
      map: map,
      schoolMarkers: schoolMarkers,
      schoolMarkerLookup: markerLookup
    });
  },

  _onReceiveProgram: function(program) {
    if (this.state.selectedSchool) {
      let school = this.state.selectedSchool;
      if (!school.properties.programs) {
        school.properties.programs = [];
      }
      school.properties.programs.push(program);
      this.setState({
        selectedSchool: school
      });
    }
  },

  _handleClickSchoolMarker: function(school) {
    this.setState({
      selectedSchool: school
    });
  },

  _handleSelectSchool: function(school) {
    this.setState({
      selectedSchool: school
    });
    // TODO: Zoom map to school
  }
});

export default LearningCollaborativeMap;
