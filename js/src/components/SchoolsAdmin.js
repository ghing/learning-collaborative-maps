import React from 'react';
import { Link } from 'react-router';

import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import SchoolStore from '../stores/SchoolStore';
import AdminTable from './AdminTable';

/**
 * Parent component for listing, editing and creating schools.
 */
class SchoolsAdmin extends React.Component {
  constructor(props) {
    super(props);

    const schoolId = props.params && props.params.schoolId ? props.params.schoolId : undefined;

    this.state = {
      schools: SchoolStore.getAll(),
      // School being created or edited
      activeSchool: SchoolsAdmin.getActiveSchool(schoolId),
    };

    this._onSchoolsChange = this._onSchoolsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeRcdts = this.handleChangeRcdts.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeGradeServed = this.handleChangeGradeServed.bind(this);
    this.handleChangeZip = this.handleChangeZip.bind(this);
    this.handleChangeLat = this.handleChangeLat.bind(this);
    this.handleChangeLng = this.handleChangeLng.bind(this);
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
    SchoolStore.addChangeListener(this._onSchoolsChange);
  }

  componentWillUnmount() {
    SchoolStore.removeChangeListener(this._onSchoolsChange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.schoolId) {
      // We're getting a schoolId from the router. This means we're editing
      // a school.  Set the active school in the state.
      this.setState({
        activeSchool: SchoolsAdmin.getActiveSchool(nextProps.params.schoolId)
      });
    }
  }

  /**
   * Returns the URL for the edit view of a particular school.
   */
  static getEditUrl(school) {
    return '/admin/schools/' + school.properties.rcdts;
  }

  /**
   * Returns a school object to be edited.
   *
   * It also flattens out the GeoJSON object returned by SchoolStore so the
   * return object is just a flat JavaScript object.
   */
  static getActiveSchool(schoolId) {
    const school = SchoolStore.getSchool(schoolId);
    if (!school) {
      return null;
    }

    const activeSchool = {
      rcdts: school.properties.rcdts,
      name: school.properties.FacilityName,
      address: school.properties.Address,
      city: school.properties.City,
      zip: school.properties.Zip,
      gradeServed: school.properties.GradeServed,
    };
    const coords = school.geometry.coordinates;
    activeSchool.lat = coords[1];
    activeSchool.lng = coords[0];
    return activeSchool;
  }

  /**
   * Returns an iterable of child components that have needed props set.
   */
  _getChildren(props) {
    if (!props.children) {
      return (
        <div>
          <div className="admin-buttons">
            <Link className="btn btn-primary" to="/admin/schools/add">Add a school</Link>
          </div>
          <AdminTable items={this.state.schools}
            columns={this.props.columns}
            getEditUrl={SchoolsAdmin.getEditUrl} />
        </div>
      );
    }

    // There are child components set by the router.  This will be the add or
    // edit form.
    // Set form input change event handler props to methods of this class.
    let schoolProps = {
      onSubmit: this.handleSubmit,
      onChangeRcdts: this.handleChangeRcdts,
      onChangeName: this.handleChangeName,
      onChangeAddress: this.handleChangeAddress,
      onChangeCity: this.handleChangeCity,
      onChangeGradeServed: this.handleChangeGradeServed,
      onChangeZip: this.handleChangeZip,
      onChangeLat: this.handleChangeLat,
      onChangeLng: this.handleChangeLng,
    };

    if (this.state.activeSchool) {
      // We're in the process of creating or editing a school.  Set the props
      // that will be used for the form input values.
      schoolProps = Object.assign(schoolProps, this.state.activeSchool);
    }

    return React.Children.map(props.children, child => React.cloneElement(child, schoolProps));
  }

  /**
   * Updates state to reflect the values in the add/edit form.
   */
  updateActiveSchool(props) {
    let activeSchool = {
      rcdts: '',
      name: '',
      address: '',
      city: '',
      zip: '',
      lat: '',
      lng: '',
    };

    if (this.state.activeSchool) {
      activeSchool = Object.assign(activeSchool, this.state.activeSchool);
    }

    this.setState({
      activeSchool: Object.assign(activeSchool, props),
    });
  }

  // Event handlers

  _onSchoolsChange(method) {
    const newState = {
      schools: SchoolStore.getAll()
    };
    let callback;

    if (method == 'update' || method == 'create') {
      newState.activeSchool = null;
      callback = () => {
        this.props.router.push('/admin/schools');
      };
    }
    else if (this.props.params.schoolId) {
      newState.activeSchool = SchoolsAdmin.getActiveSchool(this.props.params.schoolId)
    }

    this.setState(newState, callback);
  }

  handleSubmit() {
    const handleSubmit = this.props.params.schoolId ? LearningCollaborativeActions.updateSchool : LearningCollaborativeActions.createSchool;
    const activeSchool = this.state.activeSchool;

    handleSubmit(
      activeSchool.rcdts,
      activeSchool.name,
      activeSchool.address,
      activeSchool.city,
      activeSchool.zip,
      activeSchool.gradeServed,
      activeSchool.lat,
      activeSchool.lng
    );

    this.setState({
      activeSchool: null,
    });
  }

  handleChangeName(value) {
    this.updateActiveSchool({
      name: value
    });
  }

  handleChangeAddress(value) {
    this.updateActiveSchool({
      address: value
    });
  }

  handleChangeCity(value) {
    this.updateActiveSchool({
      city: value
    });
  }

  handleChangeGradeServed(value) {
    this.updateActiveSchool({
      gradeServed: value
    });
  }

  handleChangeZip(value) {
    this.updateActiveSchool({
      zip: value
    });
  }

  handleChangeRcdts(value) {
    this.updateActiveSchool({
      rcdts: value
    });
  }

  handleChangeLat(value) {
    this.updateActiveSchool({
      lat: value
    });
  }

  handleChangeLng(value) {
    this.updateActiveSchool({
      lng: value
    });
  }
}

SchoolsAdmin.defaultProps = {
  columns: [
    {
      label: "Name",
      getValue: d => d.properties.FacilityName
    }
  ]
};

export default SchoolsAdmin;
