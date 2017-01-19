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
import LearningCollaborativeConstants from '../constants/LearningCollaborativeConstants';
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
    this._onChangeMode = this._onChangeMode.bind(this);
    this._styleSchoolMarker = this._styleSchoolMarker.bind(this);
  }

  render() {
    return (
        <div className="app-container">
          <div ref="mapContainer" className="map-container"></div>
          <MapDrawer mode={this.state.mode}
                     school={this.state.selectedSchool}
                     program={this.state.selectedProgram}
                     engine={SchoolStore.getEngine()}
                     handleSelectSchool={this._handleSelectSchool}
                     agencies={this.state.agencies}
                     agencyLookup={this.state.agencyLookup}
                     programTypes={SchoolStore.getProgramTypes()}
                     createProgram={LearningCollaborativeActions.createProgram}
                     updateProgram={LearningCollaborativeActions.updateProgram}
                     contactEmail={this.props.contactEmail} />
        </div>
    );
  }

  componentDidMount() {
    SchoolStore.addChangeListener(this._onChange);
    SchoolStore.addReceiveProgramListener(this._onReceiveProgram);
    SchoolStore.addReceiveProgramNoteListener(this._onReceiveProgramNote);
    AgencyStore.addChangeListener(this._onChange);
    SchoolStore.addChangeModeListener(this._onChangeMode);

    this.setState({
      map: this._initializeMap()
    });
  }

  componentWillUnmount() {
    SchoolStore.removeChangeListener(this._onChange);
    SchoolStore.removeReceiveProgramListener(this._onReceiveProgram);
    SchoolStore.removeReceiveProgramNoteListener(this._onReceiveProgramNote);
    AgencyStore.removeChangeListener(this._onChange);
    SchoolStore.removeChangeModeListener(this._onChangeMode);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedSchool) {
      let schoolProps = this.state.selectedSchool.properties;
      let programs = this.state.selectedSchool.properties.programs;
      // HACK: Always redraw the marker, to detect possible color changes
      // based on a school's programs.  If we want to redraw only if the
      // programs change, we should represent the selected school using
      // something like Immutable.js
      if (programs && programs.length) {
        let marker = this.state.schoolMarkerLookup[schoolProps.rcdts];
        marker.setStyle(this._styleSchoolMarker(this.state.selectedSchool));
      }

      if (this.state.zoomToMarker) {
        let center = new L.LatLng(
          this.state.selectedSchool.geometry.coordinates[1],
          this.state.selectedSchool.geometry.coordinates[0]
        );
        let zoom = 15;
        this.state.map.setView(center, zoom);
      }
    }

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
    if (this.state.selectedSchool) {
      let school = this.state.selectedSchool;
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

      this.setState({
        selectedSchool: school,
        mode: LearningCollaborativeConstants.SCHOOL_DETAIL_MODE
      });
    }
  }

  _onReceiveProgramNote(program, note, method) {
    if (this.state.selectedSchool) {
      let school = this.state.selectedSchool;
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
      this.setState({
        selectedSchool: school
      });
    }
  }

  _handleClickSchoolMarker(school) {
    LearningCollaborativeActions.showSchoolDetail(school, false);
  }

  _handleSelectSchool(school) {
    LearningCollaborativeActions.showSchoolDetail(school, true);
  }

  _onChangeMode(mode, props) {
    let newState = {
      mode: mode
    };
    switch(mode) {
      case LearningCollaborativeConstants.SCHOOL_DETAIL_MODE:
        newState.selectedSchool = SchoolStore.getSelectedSchool();
        newState.zoomToMarker = props.zoomToMarker;
        break;
      case LearningCollaborativeConstants.ADD_PROGRAM_MODE:
        newState.selectedSchool = SchoolStore.getSelectedSchool();
        break;
      case LearningCollaborativeConstants.EDIT_PROGRAM_MODE:
        newState.selectedSchool = SchoolStore.getSelectedSchool();
        newState.selectedProgram = SchoolStore.getSelectedProgram();
        break;
    }
    this.setState(newState);
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
