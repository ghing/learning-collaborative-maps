import React from 'react';
import { Link } from 'react-router';

import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import AgencyStore from '../stores/AgencyStore';
import AdminTable from './AdminTable';

/**
 * Parent component for listing, editing and creating agencies.
 */
class AgenciesAdmin extends React.Component {
  constructor(props) {
    super(props);

    const slug = props.params && props.params.slug ? props.params.slug : undefined;

    this.state = {
      agencies: AgencyStore.getAll(),
      // Agency being created or edited
      activeAgency: AgenciesAdmin.getActiveAgency(slug),
    };

    // Bind class methods to this instance so `this` refers to the class
    // instance, even when the method is called in an event handler.
    this._onAgenciesChange = this._onAgenciesChange.bind(this);
    this.handleChangeSlug = this.handleChangeSlug.bind(this);
    this.handleChangeAgency = this.handleChangeAgency.bind(this);
    this.handleChangeCatchmentArea = this.handleChangeCatchmentArea.bind(this);
    this.handleChangeProgramType = this.handleChangeProgramType.bind(this);
    this.handleChangeOfficeLocation = this.handleChangeOfficeLocation.bind(this);
    this.handleChangeLat = this.handleChangeLat.bind(this);
    this.handleChangeLng = this.handleChangeLng.bind(this);
    this.handleChangeMarkerColor = this.handleChangeMarkerColor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div className="container container--admin">
        <div className="row">
          <div className="col">
            {this._getChildren(this.props)}
          </div>
        </div>
      </div>
    );
  }

  // Component lifecycle methods

  componentDidMount() {
    AgencyStore.addChangeListener(this._onAgenciesChange);
  }

  componentWillUnmount() {
    AgencyStore.removeChangeListener(this._onAgenciesChange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.slug) {
      // We're getting a slug from the router. This means we're editing
      // an agency.  Set the active agency in the state.
      this.setState({
        activeAgency: AgenciesAdmin.getActiveAgency(nextProps.params.slug)
      });
    }
  }

  /**
   * Returns the URL for the edit view of a particular agency.
   */
  static getEditUrl(agency) {
    return '/admin/agencies/' + agency.properties.slug;
  }

  /**
   * Returns an agency object to be edited.
   *
   * It also flattens out the GeoJSON object returned by AgencyStore so the
   * return object is just a flat JavaScript object.
   */
  static getActiveAgency(slug) {
    const agency = AgencyStore.getAgency(slug);
    if (!agency) {
      return null;
    }

    const activeAgency = Object.assign({}, agency.properties);
    const coords = agency.geometry.coordinates;
    activeAgency.lat = coords[1];
    activeAgency.lng = coords[0];
    return activeAgency;
  }

  /**
   * Returns an iterable of child components that have needed props set.
   */
  _getChildren(props) {
    if (!props.children) {
      // No child components set by router.
      // Return a list of agencies.
      return (
        <div>
          <div className="admin-buttons">
            <Link className="btn btn-primary" to="/admin/agencies/add">Add an agency</Link>
          </div>
          <AdminTable items={this.state.agencies}
            columns={this.props.columns}
            getEditUrl={AgenciesAdmin.getEditUrl} />
        </div>
      );
    }

    // There are child components set by the router.  This will be the add or
    // edit form.
    // Set form input change event handler props to methods of this class.
    let agencyProps = {
      onSubmit: this.handleSubmit,
      onChangeAgency: this.handleChangeAgency,
      onChangeSlug: this.handleChangeSlug,
      onChangeCatchmentArea: this.handleChangeCatchmentArea,
      onChangeProgramType: this.handleChangeProgramType,
      onChangeOfficeLocation: this.handleChangeOfficeLocation,
      onChangeLat: this.handleChangeLat,
      onChangeLng: this.handleChangeLng,
      onChangeMarkerColor: this.handleChangeMarkerColor,
      slugDisabled: this.props.params.slug ? true : false,
    };

    if (this.state.activeAgency) {
      // We're in the process of creating or editing an agency.  Set the props
      // that will be used for the form input values.
      agencyProps = Object.assign(agencyProps, this.state.activeAgency);
    }

    return React.Children.map(props.children, child => React.cloneElement(child, agencyProps));
  }

  /**
   * Updates state to reflect the values in the add/edit form.
   */
  updateActiveAgency(props) {
    let activeAgency = {
      slug: '',
      agency: '',
      catchment_area: '',
      program_type: '',
      office_location: '',
      lat: '',
      lng: '',
      marker_color: '#000000'
    };

    if (this.state.activeAgency) {
      activeAgency = Object.assign(activeAgency, this.state.activeAgency);
    }

    this.setState({
      activeAgency: Object.assign(activeAgency, props),
    });
  }

  // Event handlers

  _onAgenciesChange(method) {
    const newState = {
      agencies: AgencyStore.getAll()
    };
    let callback;

    if (method == 'update' || method == 'create') {
      newState.activeAgency = null;
      callback = () => {
        this.props.router.push('/admin/agencies');
      };
    }
    else if (this.props.params.slug) {
      newState.activeAgency = AgenciesAdmin.getActiveAgency(this.props.params.slug);
    }

    this.setState(newState, callback);
  }

  handleSubmit() {
    const handleSubmit = this.props.params.slug ? LearningCollaborativeActions.updateAgency : LearningCollaborativeActions.createAgency;
    const activeAgency = this.state.activeAgency;

    handleSubmit(
      activeAgency.slug,
      activeAgency.agency,
      activeAgency.catchment_area,
      activeAgency.program_type,
      activeAgency.office_location,
      activeAgency.lat,
      activeAgency.lng,
      activeAgency.marker_color
    );

    this.setState({
      activeAgency: null,
    });
  }

  handleChangeSlug(value) {
    this.updateActiveAgency({
      slug: value
    });
  }

  handleChangeAgency(value) {
    this.updateActiveAgency({
      agency: value
    });
  }

  handleChangeCatchmentArea(value) {
    this.updateActiveAgency({
      catchment_area: value
    });
  }

  handleChangeProgramType(value) {
    this.updateActiveAgency({
      program_type: value
    });
  }

  handleChangeOfficeLocation(value) {
    this.updateActiveAgency({
      office_location: value
    });
  }

  handleChangeLat(value) {
    this.updateActiveAgency({
      lat: value
    });
  }

  handleChangeLng(value) {
    this.updateActiveAgency({
      lng: value
    });
  }

  handleChangeMarkerColor(value) {
    this.updateActiveAgency({
      marker_color: value
    });
  }
}

AgenciesAdmin.defaultProps = {
  columns: [
    {
      label: "Name",
      getValue: d => d.properties.agency
    }
  ]
}

export default AgenciesAdmin;
