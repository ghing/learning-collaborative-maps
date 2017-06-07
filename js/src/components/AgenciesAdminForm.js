import React from 'react';


class AgenciesAdminForm extends React.Component {
  constructor(props) {
    super(props);

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
          <input type="text" id="slug" value={this.props.slug} onChange={this.handleChangeSlug} className="form-control" required="required" disabled={this.props.slugDisabled} />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="agency">Agency name</label>
          <input type="text" id="agency" value={this.props.agency} onChange={this.handleChangeAgency} className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="catchment_area">Catchment area</label>
          <input type="text" id="catchment_area" value={this.props.catchment_area} onChange={this.handleChangeCatchmentArea} className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="program_type">Program type</label>
          <input type="text" id="program_type" value={this.props.program_type} onChange={this.handleChangeProgramType} className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="office_location">Office location</label>
          <textarea id="office_location" value={this.props.office_location} onChange={this.handleChangeOfficeLocation} className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="lat">Latitude</label>
          <input type="text" id="lat" value={this.props.lat} onChange={this.handleChangeLat} className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="lng">Longitude</label>
          <input type="text" id="lng" value={this.props.lng} onChange={this.handleChangeLng} className="form-control" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="marker_color">Marker color</label>
          <input type="color" id="marker_color" value={this.props.marker_color} onChange={this.handleChangeMarkerColor} className="form-control" />
        </fieldset>

        <button className="btn btn-primary" type="submit">Submit</button>
      </form>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit();
  }

  handleChangeAgency(evt) {
    this.props.onChangeAgency(evt.target.value);
  }

  handleChangeSlug(evt) {
    this.props.onChangeSlug(evt.target.value);
  }

  handleChangeCatchmentArea(evt) {
    this.props.onChangeCatchmentArea(evt.target.value);
  }

  handleChangeProgramType(evt) {
    this.props.onChangeProgramType(evt.target.value);
  }

  handleChangeOfficeLocation(evt) {
    this.props.onChangeOfficeLocation(evt.target.value);
  }

  handleChangeLat(evt) {
    this.props.onChangeLat(evt.target.value);
  }

  handleChangeLng(evt) {
    this.props.onChangeLng(evt.target.value);
  }

  handleChangeMarkerColor(evt) {
    this.props.onChangeMarkerColor(evt.target.value);
  }
}

AgenciesAdminForm.defaultProps = {
  slug: "",
  slugDisabled: false,
  agency: "",
  catchment_area: "",
  program_type: "",
  office_location: "",
  lat: "",
  lng: "",
  marker_color: "#000000",
};

export default AgenciesAdminForm;
