import React from 'react';


class SchoolsAdminForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rcdts: "",
      name: "",
      address: "",
      city: "",
      gradeServed: "",
      zip: "",
      lat: "",
      lng: ""
    };

    if (this.props.school) {
      const schoolCoords = this.props.school.geometry.coordinates;
      const schoolProps = this.props.school.properties;

      this.state.rcdts = schoolProps.rcdts;
      this.state.name = schoolProps.FacilityName;
      this.state.address = schoolProps.Address;
      this.state.city = schoolProps.City;
      this.state.gradeServed = schoolProps.GradeServed;
      this.state.zip = schoolProps.Zip;
      this.state.lat = schoolCoords[1];
      this.state.lng = schoolCoords[0];
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeRcdts = this.handleChangeRcdts.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeGradeServed = this.handleChangeGradeServed.bind(this);
    this.handleChangeZip = this.handleChangeZip.bind(this);
    this.handleChangeLat = this.handleChangeLat.bind(this);
    this.handleChangeLng = this.handleChangeLng.bind(this);
  }

  render() {
    // TODO: Add cancel button
    return (
      <form className="schools-admin-form" onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <label htmlFor="rcdts">RCDTS code</label>
          <input type="text" id="rcdts" value={this.state.rcdts} onChange={this.handleChangeRcdts} ref="rcdts" className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={this.state.name} onChange={this.handleChangeName} ref="name" className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" value={this.state.address} onChange={this.handleChangeAddress} ref="address" className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" value={this.state.city} onChange={this.handleChangeCity} ref="city" className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="zip">Zip code</label>
          <input type="text" id="zip" value={this.state.zip} onChange={this.handleChangeZip} ref="zip" className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="gradeServed">Grades served</label>
          <input type="text" id="gradeServed" value={this.state.gradeServed} onChange={this.handleChangeGradeServed} ref="gradeServed" className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="lat">Latitude</label>
          <input type="text" id="lat" value={this.state.lat} onChange={this.handleChangeLat} ref="lat" className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="lng">Longitude</label>
          <input type="text" id="lng" value={this.state.lng} onChange={this.handleChangeLng} ref="lng" className="form-control" required="required" />
        </fieldset>

        <button className="btn btn-primary" type="submit">Submit</button>

      </form>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const handleSubmit = this.props.school ? this.props.handleUpdate : this.props.handleCreate;

    handleSubmit(
      this.state.rcdts,
      this.state.name,
      this.state.address,
      this.state.city,
      this.state.zip,
      this.state.gradeServed,
      this.state.lat,
      this.state.lng
    );

    this.setState({
      rcdts: '',
      name: '',
      address: '',
      city: '',
      gradeServed: '',
      zip: '',
      lat: '',
      lng: ''
    });
  }

  handleChangeName(evt) {
    this.setState({
      name: evt.target.value
    });
  }

  handleChangeAddress(evt) {
    this.setState({
      address: evt.target.value
    });
  }

  handleChangeCity(evt) {
    this.setState({
      city: evt.target.value
    });
  }

  handleChangeGradeServed(evt) {
    this.setState({
      gradeServed: evt.target.value
    });
  }

  handleChangeZip(evt) {
    this.setState({
      zip: evt.target.value
    });
  }

  handleChangeRcdts(evt) {
    this.setState({
      rcdts: evt.target.value
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
}

export default SchoolsAdminForm;
