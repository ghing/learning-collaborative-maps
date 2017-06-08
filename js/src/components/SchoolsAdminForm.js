import React from 'react';


class SchoolsAdminForm extends React.Component {
  constructor(props) {
    super(props);

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
    // TODO: Add cancel button
    return (
      <form className="schools-admin-form" onSubmit={this.handleSubmit}>
        <fieldset className="form-group">
          <label htmlFor="rcdts">RCDTS code</label>
          <input type="text" id="rcdts" value={this.props.rcdts} onChange={this.handleChangeRcdts} className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={this.props.name} onChange={this.handleChangeName} className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" value={this.props.address} onChange={this.handleChangeAddress} className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" value={this.props.city} onChange={this.handleChangeCity} className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="zip">Zip code</label>
          <input type="text" id="zip" value={this.props.zip} onChange={this.handleChangeZip} className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="gradeServed">Grades served</label>
          <input type="text" id="gradeServed" value={this.props.gradeServed} onChange={this.handleChangeGradeServed} className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="lat">Latitude</label>
          <input type="text" id="lat" value={this.props.lat} onChange={this.handleChangeLat} className="form-control" required="required" />
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor="lng">Longitude</label>
          <input type="text" id="lng" value={this.props.lng} onChange={this.handleChangeLng} className="form-control" required="required" />
        </fieldset>

        <button className="btn btn-primary" type="submit">Submit</button>

      </form>
    );
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit();
  }

  handleChangeName(evt) {
    this.props.onChangeName(evt.target.value);
  }

  handleChangeAddress(evt) {
    this.props.onChangeAddress(evt.target.value);
  }

  handleChangeCity(evt) {
    this.props.onChangeCity(evt.target.value);
  }

  handleChangeGradeServed(evt) {
    this.props.onChangeGradeServed(evt.target.value);
  }

  handleChangeZip(evt) {
    this.props.onChangeZip(evt.target.value);
  }

  handleChangeRcdts(evt) {
    this.props.onChangeRcdts(evt.target.value);
  }

  handleChangeLat(evt) {
    this.props.onChangeLat(evt.target.value);
  }

  handleChangeLng(evt) {
    this.props.onChangeLng(evt.target.value);
  }
}

SchoolsAdminForm.defaultProps = {
  rcdts: "",
  name: "",
  address: "",
  city: "",
  zip: "",
  gradeServed: "",
  lat: "",
  lng: "",
};

export default SchoolsAdminForm;
