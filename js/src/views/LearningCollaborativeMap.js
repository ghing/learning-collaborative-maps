import L from 'leaflet';
import React from 'react';

const LearningCollaborativeMap = React.createClass({
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

  render: function() {
    return <div ref="mapContainer" className="map-container-inner" />; 
  },

  componentDidMount: function() {
    let component = this;
    let map = L.map(this.refs.mapContainer)
      .setView(this.props.center, this.props.initialZoom);
  
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    var schoolMarkers = L.geoJson(this.props.schools, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, component.props.makerOptions);
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`<h2 class="school-name">${feature.properties.FacilityName}</h2>`);
      }
    }).addTo(map); 

    map.fitBounds(schoolMarkers.getBounds());
  }
});

export default LearningCollaborativeMap;
