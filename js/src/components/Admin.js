import React from 'react';
import { Link } from 'react-router';


class Admin extends React.Component {
  render() {
    const children = this.props.children || (
      <div className="admin-list-container">
        <div className="list-group admin-list">
          <Link to="/admin/schools" className="list-group-item list-group-item-action">Administer schools</Link>
        </div>
      </div>
    );

    return (
        <div className="app-container">
          {children}
        </div>
    );
  }
}

export default Admin;
