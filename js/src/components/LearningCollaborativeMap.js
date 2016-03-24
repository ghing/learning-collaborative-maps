import assign from 'object-assign';
import L from 'leaflet';
import React from 'react';

import SchoolStore from '../stores/SchoolStore';
import AgencyStore from '../stores/AgencyStore';

import MapDrawer from './MapDrawer';

const LearningCollaborativeMap = React.createClass({
  getInitialState: function() {
    return {
      schools: SchoolStore.getAll(),
      agencies: AgencyStore.getAll(),
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
    TodoStore.removeChangeListener(this._onChange);
    AgencyStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div className="app-container"> 
        <div ref="mapContainer" className="map-container"></div> 
        <MapDrawer school={this.state.selectedSchool}/>
      </div>  
    );
  },

  componentDidMount: function() {
    SchoolStore.addChangeListener(this._onChange);
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
          component._handleClickSchool(feature);
        });
      }
    }).addTo(map); 

    map.fitBounds(schoolMarkers.getBounds());
  },

  _onChange: function() {
    this.setState({
      schools: SchoolStore.getAll(),
      agencies: AgencyStore.getAll()
    });
  },

  _handleClickSchool: function(school) {
    this.setState({
      selectedSchool: school
    });
  }
});

export default LearningCollaborativeMap;
