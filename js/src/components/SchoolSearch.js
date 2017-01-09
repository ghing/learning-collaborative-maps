import React from 'react';
import $ from 'jquery';
import 'typeahead.js/dist/typeahead.jquery.js';


const SchoolSearch = React.createClass({
  render: function() {
    return (
      <form className="school-search">
        <input type="text" className="form-control" placeholder="Enter a school name to search" ref="searchInput" />
      </form>
    );
  },

  componentDidMount: function() {
    if (this.props.engine) {
      this._initializeTypeahead();
    }
  },

  componentDidUpdate: function() {
    if (this.props.engine) {
      // If the typeahead jQuery plugin hasn't been initialized yet,
      // initialize it.
      // This guard prevents initializing the jQuery plugin multiple times.
      if (!$(this.refs.searchInput).data('ttTypeahead')) {
        this._initializeTypeahead();
      }
    }
  },

  _initializeTypeahead: function() {
    $(this.refs.searchInput).typeahead({
      minLength: 3,
      highlight: true
    },
    {
      name: 'schools',
      source: this.props.engine,
      display: school => school.properties.FacilityName
    }).on('typeahead:select', (ev, school) => {
      this.props.handleSelectSchool(school);
    });
  }
});

export default SchoolSearch;
