import React from 'react';

/**
 * Main application container component for this app
 */
class LearningCollaborativeApp extends React.Component {
  render() {
    return (
      <div className="app-container">
        {this.props.children}
      </div>
    )
  }
}

export default LearningCollaborativeApp;
