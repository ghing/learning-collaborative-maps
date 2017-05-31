import React from 'react';
import { Link } from 'react-router';

import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import SchoolStore from '../stores/SchoolStore';
import AdminTable from './AdminTable';


class SchoolsAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schools: SchoolStore.getAll()
    };

    this._onSchoolsChange = this._onSchoolsChange.bind(this);
  }

  getEditUrl(school) {
    return '/admin/schools/' + school.properties.rcdts;
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

  componentDidMount() {
    SchoolStore.addChangeListener(this._onSchoolsChange);
  }

  componentWillUnmount() {
    SchoolStore.removeChangeListener(this._onSchoolsChange);
  }

  _onSchoolsChange(method) {
    this.setState({
      schools: SchoolStore.getAll()
    });

    if (method == 'update' || method == 'create') {
      this.props.router.push('/admin/schools');
    }
  }

  _getChildren(props) {
    if (!props.children) {
      return (
        <div>
          <div className="admin-buttons">
            <Link className="btn btn-primary" to="/admin/schools/add">Add a school</Link>
          </div>
          <AdminTable items={this.state.schools}
            columns={this.props.columns}
            getEditUrl={this.getEditUrl} />
        </div>
      );
    }

    // TODO: Fix this so add isn't broken
    if (props.params.schoolId && this._hasSchools()) {
      const schoolProps = {
        handleCreate: LearningCollaborativeActions.createSchool,
        handleUpdate: LearningCollaborativeActions.updateSchool,
        school:  SchoolStore.getSchool(props.params.schoolId)
      };
      return React.Children.map(props.children, child => React.cloneElement(child, schoolProps));
    }

    return props.children;
  }

  _hasSchools() {
    return (this.state.schools && this.state.schools.length > 0);
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
