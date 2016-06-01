import React from 'react'; 

/**
 * React component that renders a select control that adds a text input
 * allowing the user to enter an "Other" option.
 */
const SelectWithOther = React.createClass({
  getDefaultProps: function() {
    return {
      options: [],
      onChange: function(value) {} 
    };
  },

  getInitialSelectValue: function() {
    if (!this.props.value) {
      return '';
    } 

    let i;
    for (i = 0; i < this.props.options.length; i++) {
      if (this.props.options[i] == this.props.value) {
        return this.props.value;
      }
    }

    return '__other__';
  },

  getInitialInputValue: function() {
    if (!this.props.value) {
      return '';
    }

    let i;
    for (i = 0; i < this.props.options.length; i++) {
      if (this.props.options[i] == this.props.value) {
        return ''; 
      }
    }

    return this.props.value;
  },

  getInitialState: function() {
    return {
      selectValue: this.getInitialSelectValue(),
      inputValue: this.getInitialInputValue()
    };
  },

  getInput: function() {
    if (this.state.selectValue == '__other__') {
      return <input type="text" className={this.props.inputClassName} value={this.state.inputValue} onChange={this.handleChangeInput} />;
    }

    return false;
  },

  render: function() {
    const options = [
      <option value="" key=""></option>
    ]
    .concat(this.props.options.map(option => {
        return <option value={option} key={option}>{option}</option>;
    }))
    .concat([
      <option value="__other__" key="__other__">Other</option>
    ]);

    const input = this.getInput();

    return (
      <div>
        <select className={this.props.selectClassName} value={this.state.selectValue} onChange={this.handleChangeSelect}>
          {options}
        </select>
        {input}
      </div>
    );
  },

  handleChangeSelect: function(e) {
    this.setState({
      selectValue: e.target.value 
    }, () => {
      this.props.onChange(this.getValue());
    });
  },

  handleChangeInput: function(e) {
    this.setState({
      inputValue: e.target.value
    }, () => {
      this.props.onChange(this.getValue());
    });
  },

  getValue: function() {
    if (this.state.selectValue == '__other__') {
      return this.state.inputValue;
    }
    else {
      return this.state.selectValue;
    }
  }
});

export default SelectWithOther;
