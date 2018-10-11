import React from 'react';
import { Link } from 'react-router';

import {agencyIdFromUrl} from "../utils";

class SchoolProgram extends React.Component {
  render() {
    let program = this.props.program;
    let agencyId = agencyIdFromUrl(program.agency);
    let agency = this.props.agencyLookup[agencyId];
    let programText = agency.properties.agency;
    if (program.program_type) {
      programText += " - " + program.program_type;
    }
    if (program.age_group) {
      programText += " (" + program.age_group + ")";
    }
    if (program.dates) {
      programText += " - " + program.dates;
    }
    const schoolId = this.props.school.properties.rcdts;
    const programId = program._id;
    const editProgramPath = `/schools/${schoolId}/programs/${programId}/edit`;
    const schoolYearLabel = program.schoolYearStart ? <span className="school-year-label badge badge-primary">{program.schoolYearStart}</span> : false;

    return (
      <li className="school-program">
        {schoolYearLabel} 
        <span>{programText}</span>
        <Link to={editProgramPath} className="edit-link">Edit</Link>
      </li>
    );
  }
}

export default SchoolProgram;
