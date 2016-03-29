import assign from 'object-assign';
import L from 'leaflet';
import React from 'react';

import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import SchoolStore from '../stores/SchoolStore';
import AgencyStore from '../stores/AgencyStore';

import MapDrawer from './MapDrawer';

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
        radius: 2,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    }
  },

  componentWillUnmount: function() {
    SchoolStore.removeChangeListener(this._onChange);
    SchoolStore.removeReceiveProgramListener(this._onReceiveProgram);
    AgencyStore.removeChangeListener(this._onChange);
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
    if (this.state.schools.length && this.state.agencies.length) {
      this._initializeMap();
    }
  },

  componentDidUpdate: function() {
    if (this.state.schools.length && this.state.agencies.length) {
      this._initializeMap();
    }
  },

  _initializeMap: function() {
    let component = this;
    let map = L.map(this.refs.mapContainer, {
        zoomControl: false
      })
      .setView(this.props.center, this.props.initialZoom);

    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);  
  
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    var schoolMarkers = L.geoJson(this.state.schools, {
      pointToLayer: function(feature, latlng) {
        let markerOptions = assign({}, component.props.markerOptions);
        let programs = feature.properties.programs;
        let agencyBits;
        let agencySlug;

        if (programs && programs.length) {
          if (programs.length > 1) {
            markerOptions.fillColor = 'black';
          }
          else {
            agencyBits = programs[0].agency.split('/');
            agencySlug = agencyBits[agencyBits.length - 1]; 
            markerOptions.fillColor = AgencyStore.getColorScale()(agencySlug);
          }
        }

        return L.circleMarker(latlng, markerOptions);
      },
      onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
          component._handleClickSchoolMarker(feature);
        });
      }
    }).addTo(map); 

    map.fitBounds(schoolMarkers.getBounds());
  },

  _onChange: function() {
    this.setState({
      schools: SchoolStore.getAll(),
      agencies: AgencyStore.getAll(),
      agencyLookup: AgencyStore.getLookup()
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
