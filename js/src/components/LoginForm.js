import React from 'react';

import LoginTokenSentMessage from './LoginTokenSentMessage';
import LearningCollaborativeActions from '../actions/LearningCollaborativeActions';
import UserStore from '../stores/UserStore';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLoginUserReceived = this.handleLoginUserReceived.bind(this);
  }

  render() {
    let child;

    if (this.state.user) {
      child = <LoginTokenSentMessage />;
    }
    else {
      child = (
        <form className="login-form" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            <input id="email-input"
                type="email"
                value={this.state.email ? this.state.email : ''}
                className="form-control"
                placeholder="Enter your email"
                onChange={this.handleChangeEmail} />
          </fieldset>
          <button type="submit" className="btn btn-primary submit-login">Send me a login link</button>
          <small className="form-text text-muted">This app uses a <a href="https://www.sitepoint.com/passwordless-authentication-works/">passwordless login system</a>. Enter your email address and you'll be emailed a special link that will log you in.  You should stay logged in unless you switch devices or clear persona data in your browser.  If that happens, just re-enter your email address and you'll be sent a new login link.</small>
        </form>
      );
    }

    return (
      <div className="login-container">
        {child}
      </div>
    );
  }

  componentDidMount() {
    UserStore.addLoginUserReceivedListener(this.handleLoginUserReceived);
  }

  componentWillUnmount() {
    UserStore.removeLoginUserReceivedListener(this.handleLoginUserReceived);
  }

  handleChangeEmail(evt) {
    this.setState({
      email: evt.target.value
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();

    LearningCollaborativeActions.requestLoginToken({
      email: this.state.email
    });
  }

  handleLoginUserReceived(user) {
    this.setState({
      user: user
    });
  }
}


export default LoginForm;
