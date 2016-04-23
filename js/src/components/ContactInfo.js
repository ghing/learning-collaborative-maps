import React from 'react';

const ContactInfo = React.createClass({
  render: function() {
    return (
      <div className="contact-info">
        <p>If you have any comments or questions, please email <a href={'mailto:' + this.props.contactEmail}>{this.props.contactEmail}</a>.</p>
      </div>
    );
  }
});

export default ContactInfo;
