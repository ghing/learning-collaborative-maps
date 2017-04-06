import React from 'react';

import AdminTableRow from './AdminTableRow';


class AdminTable extends React.Component {
  render() {
    if (!(this.props.items && this.props.items.length)) {
      return false;
    }

    const rows = this.props.items.map((item, i) => {
      return <AdminTableRow key={i}
        item={item}
        columns={this.props.columns}
        editUrl={this.props.getEditUrl(item)} />;
    });

    const headerCells = this.props.columns.map((col, i) => <th key={i}>{col.label} </th>);

    return (
      <table>
        <thead>
          <tr>{headerCells}</tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

export default AdminTable;
