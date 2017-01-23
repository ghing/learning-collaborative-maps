import assign from 'object-assign';
// We have to use require() here because ES6 module loading doesn't seem
// to support conditional imports
// We have to import conditionally, because Leaflet doesn't check if
// `window` is defined, and it won't be when we render server side
var L;
if (typeof window != 'undefined') {
  L = require('leaflet');
}
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
  // We could do return [...agencySet] except sets aren't iterable in IE
  let agencies = [];
  agencySet.forEach(agencySlug => {
    agencies.push(agencySlug);
  });
  return agencies;
}

class LearningCollaborativeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schools: SchoolStore.getAll(),
      agencies: AgencyStore.getAll(),
      agencyLookup: AgencyStore.getLookup(),
      agencyColorScale: AgencyStore.getColorScale()
    };

    this._onChange = this._onChange.bind(this);
    this._onReceiveProgram = this._onReceiveProgram.bind(this);
    this._onReceiveProgramNote = this._onReceiveProgramNote.bind(this);
    this._onZoomToMarker = this._onZoomToMarker.bind(this);
    this._styleSchoolMarker = this._styleSchoolMarker.bind(this);
  }

  render() {
    const children = this._getChildren(this.props);
    return (
        <div className="app-container">
          <div ref="mapContainer" className="map-container"></div>
          <MapDrawer engine={SchoolStore.getEngine()}
                     handleSelectSchool={this._handleSelectSchool}
                     contactEmail={this.props.contactEmail} >
            {children}
          </MapDrawer>
        </div>
    );
  }

  componentDidMount() {
    SchoolStore.addChangeListener(this._onChange);
    SchoolStore.addReceiveProgramListener(this._onReceiveProgram);
    SchoolStore.addReceiveProgramNoteListener(this._onReceiveProgramNote);
    AgencyStore.addChangeListener(this._onChange);
    SchoolStore.addZoomToMarkerListener(this._onZoomToMarker);

    this.setState({
      map: this._initializeMap()
    });
  }

  componentWillUnmount() {
    SchoolStore.removeChangeListener(this._onChange);
    SchoolStore.removeReceiveProgramListener(this._onReceiveProgram);
    SchoolStore.removeReceiveProgramNoteListener(this._onReceiveProgramNote);
    AgencyStore.removeChangeListener(this._onChange);
    SchoolStore.removeZoomToMarkerListener(this._onZoomToMarker);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.params.schoolId && this._hasSchools()) {
      const school = SchoolStore.getSchool(this.props.params.schoolId);
      const schoolProps = school.properties;
      const programs = school.properties.programs;
      // HACK: Always redraw the marker, to detect possible color changes
      // based on a school's programs.  If we want to redraw only if the
      // programs change, we should represent the selected school using
      // something like Immutable.js
      if (programs && programs.length) {
        const marker = this.state.schoolMarkerLookup[schoolProps.rcdts];
        marker.setStyle(this._styleSchoolMarker(school));
      }

      if (this.state.zoomToMarkerSchool) {
        const center = new L.LatLng(
          this.state.zoomToMarkerSchool.geometry.coordinates[1],
          this.state.zoomToMarkerSchool.geometry.coordinates[0]
        );
        const zoom = 15;
        this.state.map.setView(center, zoom);
      }
    }
  }

  _getChildren(props) {
    if (props.params.schoolId && this._hasSchools()) {
      let schoolProps = {
        school: SchoolStore.getSchool(props.params.schoolId),
        agencies: this.state.agencies,
        agencyLookup: this.state.agencyLookup,
        programTypes: SchoolStore.getProgramTypes(),
        createProgram: LearningCollaborativeActions.createProgram,
        updateProgram: LearningCollaborativeActions.updateProgram
      };

      if (props.params.programId) {
        schoolProps.program = SchoolStore.getProgram(props.params.schoolId,
          props.params.programId);
      }
      return React.Children.map(props.children, child => React.cloneElement(child, schoolProps));
    }

    return props.children;
  }

  _hasSchools() {
    return (this.state.schools && this.state.schools.length > 0);
  }

  _initializeMap() {
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
  }

  _styleSchoolMarker(feature) {
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
  }

  _getSchoolMarkers(schools) {
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
          offset: [0, -6]
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
  }

  _onChange() {
    let schools = SchoolStore.getAll();
    let map = this.state.map;
    let schoolMarkers, markerLookup;
    [schoolMarkers, markerLookup] = this._getSchoolMarkers(schools);

    if (schools.length) {
      schoolMarkers.addTo(map);
      map.fitBounds(schoolMarkers.getBounds());
    }

    this.setState({
      schools: schools,
      agencies: AgencyStore.getAll(),
      agencyLookup: AgencyStore.getLookup(),
      map: map,
      schoolMarkers: schoolMarkers,
      schoolMarkerLookup: markerLookup
    });
  }

  _onReceiveProgram(program, method) {
    if (this.props.params.schoolId) {
      const school = SchoolStore.getSchool(this.props.params.schoolId);

      if (!school.properties.programs) {
        school.properties.programs = [];
      }
      if (method == 'update') {
        school.properties.programs.some(function(p, i) {
          if (p._id == program._id) {
            school.properties.programs[i] = program;
            return true;
          }
        });
      }
      else {
        school.properties.programs.push(program);
      }

      this.props.router.push(`/schools/${this.props.params.schoolId}`);
    }
  }

  _onReceiveProgramNote(program, note, method) {
    if (this.props.params.schoolId) {
      const school = SchoolStore.getSchool(this.props.params.schoolId);
      school.properties.programs.some(function(p, i) {
        if (p._id == program._id) {
          if (method === 'update') {
            let noteFound = false;
            school.properties.programs[i].notes.some(function(n, j) {
              if (n._id == note._id) {
                school.properties.programs[i].notes[j] = note;
                noteFound = true;
                return true;
              }
            });
          }
          else {
            if (!school.properties.programs[i].notes) {
              school.properties.programs[i].notes = [];
            }
            school.properties.programs[i].notes.push(note);
          }
          return true;
        }
      });
    }
  }

  _handleClickSchoolMarker(school) {
    LearningCollaborativeActions.showSchoolDetail(school);
  }

  _handleSelectSchool(school) {
    LearningCollaborativeActions.showSchoolDetail(school);
    LearningCollaborativeActions.zoomToMarker(school);
  }

  _onZoomToMarker(school) {
    this.setState({
      zoomToMarkerSchool: school
    });
  }
}

LearningCollaborativeMap.defaultProps = {
  center: [41.881832, -87.623177],
  initialZoom: 13,
  markerOptions: {
    radius: 9,
    fillColor: "#bdbdbd",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  multipleAgencyFillColor: 'black',
  contactEmail: 'Mwalsh@betweenfriendschicago.org'
};

export default LearningCollaborativeMap;
