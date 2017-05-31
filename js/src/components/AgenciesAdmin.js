import React from 'react';
import { Link } from 'react-router';

import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import AgencyStore from '../stores/AgencyStore';
import AdminTable from './AdminTable';


class AgenciesAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      agencies: AgencyStore.getAll()
    };

    this._onAgenciesChange = this._onAgenciesChange.bind(this);
  }

  getEditUrl(agency) {
    return '/admin/agencies/' + agency.properties.slug;
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
    AgencyStore.addChangeListener(this._onAgenciesChange);
  }

  componentWillUnmount() {
    AgencyStore.removeChangeListener(this._onAgenciesChange);
  }

  _onAgenciesChange(method) {
    this.setState({
      agencies: AgencyStore.getAll()
    });

    if (method == 'update' || method == 'create') {
      this.props.router.push('/admin/agencies');
    }
  }

  _getChildren(props) {
    if (!props.children) {
      return (
        <div>
          <div className="admin-buttons">
            <Link className="btn btn-primary" to="/admin/agencies/add">Add an agency</Link>
          </div>
          <AdminTable items={this.state.agencies}
            columns={this.props.columns}
            getEditUrl={this.getEditUrl} />
        </div>
      );
    }

    const agencyProps = {
      handleCreate: LearningCollaborativeActions.createAgency,
      handleUpdate: LearningCollaborativeActions.updateAgency
    };

    if (props.params.slug && this._hasAgencies()) {
      agencyProps.agency = AgencyStore.getAgency(props.params.slug);
    }

    return React.Children.map(props.children, child => React.cloneElement(child, agencyProps));
  }

  _hasAgencies() {
    return (this.state.agencies && this.state.agencies.length > 0);
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
