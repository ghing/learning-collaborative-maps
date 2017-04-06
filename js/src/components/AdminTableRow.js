import React from 'react';
import { Link } from 'react-router';


class AdminTableRow extends React.Component {
  render() {
    const cells = this.props.columns.map((col, i) => {
      const interior = i == 0 ? <Link to={this.props.editUrl}>{col.getValue(this.props.item)}</Link> : col.getValue(this.props.item);
      return <td key={i}>{interior}</td>;
    });

    return <tr>{cells}</tr>;
  }
}

export default AdminTableRow;
