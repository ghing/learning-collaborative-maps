import React from 'react';


class AgenciesAdminForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slug: '',
      agency: '',
      catchment_area: '',
      program_type: '',
      office_location: '',
      lat: '',
      lng: '',
      marker_color: '#000000'
    };

    if (props.agency) {
      const coords = props.agency.geometry.coordinates;
      const agencyProps = props.agency.properties;

      this.state.slug = agencyProps.slug;
      this.state.slugDisabled = true;
      this.state.agency = agencyProps.agency;
      this.state.catchment_area = agencyProps.catchment_area;
      this.state.program_type = agencyProps.program_type;
      this.state.office_location = agencyProps.office_location;
      this.state.marker_color = agencyProps.marker_color;

      this.state.lat = coords[1];
      this.state.lng = coords[0];
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeAgency = this.handleChangeAgency.bind(this);
    this.handleChangeSlug = this.handleChangeSlug.bind(this);
    this.handleChangeCatchmentArea = this.handleChangeCatchmentArea.bind(this);
    this.handleChangeProgramType = this.handleChangeProgramType.bind(this);
    this.handleChangeOfficeLocation = this.handleChangeOfficeLocation.bind(this);
    this.handleChangeLat = this.handleChangeLat.bind(this);
    this.handleChangeLng = this.handleChangeLng.bind(this);
    this.handleChangeMarkerColor = this.handleChangeMarkerColor.bind(this);
  }

  render() {
    // TODO: Add cancel button
    return (
      <form className="agencies-admin-form" onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <label htmlFor="slug">Slug</label>
          <input type="text" id="slug" value={this.state.slug} onChange={this.handleChangeSlug} ref="slug" className="form-control" required="required" disabled={this.state.slugDisabled} />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="agency">Agency name</label>
          <input type="text" id="agency" value={this.state.agency} onChange={this.handleChangeAgency} ref="agency" className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="catchment_area">Catchment area</label>
          <input type="text" id="catchment_area" value={this.state.catchment_area} onChange={this.handleChangeCatchmentArea} ref="catchment_area" className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="program_type">Program type</label>
          <input type="text" id="program_type" value={this.state.program_type} onChange={this.handleChangeProgramType} ref="program_type" className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="office_location">Office location</label>
          <textarea id="office_location" value={this.state.office_location} onChange={this.handleChangeOfficeLocation} ref="office_location" className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="lat">Latitude</label>
          <input type="text" id="lat" value={this.state.lat} onChange={this.handleChangeLat} ref="lat" className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="lng">Longitude</label>
          <input type="text" id="lng" value={this.state.lng} onChange={this.handleChangeLng} ref="lng" className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="marker_color">Marker color</label>
          <input type="color" id="marker_color" value={this.state.marker_color} onChange={this.handleChangeMarkerColor} ref="marker_color" className="form-control" />
        </fieldset>

        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const handleSubmit = this.props.agency ? this.props.handleUpdate : this.props.handleCreate;

    handleSubmit(
      this.state.slug,
      this.state.agency,
      this.state.catchment_area,
      this.state.program_type,
      this.state.office_location,
      this.state.lat,
      this.state.lng,
      this.state.marker_color
    );

    this.setState({
      slug: '',
      agency: '',
      catchment_area: '',
      program_type: '',
      office_location: '',
      lat: '',
      lng: '',
      marker_color: '#000000'
    });
  }

  handleChangeAgency(evt) {
    this.setState({
      agency: evt.target.value
    });
  }

  handleChangeSlug(evt) {
    this.setState({
      slug: evt.target.value
    });
  }

  handleChangeCatchmentArea(evt) {
    this.setState({
      catchment_area: evt.target.value
    });
  }

  handleChangeProgramType(evt) {
    this.setState({
      program_type: evt.target.value
    });
  }

  handleChangeOfficeLocation(evt) {
    this.setState({
      office_location: evt.target.value
    });
  }

  handleChangeLat(evt) {
    this.setState({
      lat: evt.target.value
    });
  }

  handleChangeLng(evt) {
    this.setState({
      lng: evt.target.value
    });
  }

  handleChangeMarkerColor(evt) {
    this.setState({
      marker_color: evt.target.value
    });
  }
}

export default AgenciesAdminForm;
