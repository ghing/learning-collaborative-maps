import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import SelectWithOther from '../js/src/components/SelectWithOther';

describe('SelectWithOther', () => {
  const options = [
    'Dating/Partner Violence',
    'Dating/Partner Violence/Bullying',
    'Prevention + Intervention',
    'Sexual Health',
    'Sexual Violence',
    'Sexual Violence/Exploitation'
  ];

  it('renders initially with a select and no text input', () => {
    const component = TestUtils.renderIntoDocument(
      <SelectWithOther />
    );

    const componentNode = ReactDOM.findDOMNode(component);
    expect(componentNode.childNodes.length).toEqual(1);
    expect(componentNode.firstChild.nodeName.toLowerCase()).toEqual('select');
  });

  it('renders options based on a list of strings passed as an options prompt', () => {

    const component = TestUtils.renderIntoDocument(
      <SelectWithOther options={options} />
    );

    const componentNode = ReactDOM.findDOMNode(component);

    expect(componentNode.firstChild.firstChild.textContent).toEqual("");
    expect(componentNode.firstChild.firstChild.getAttribute('value')).toEqual("");
    options.forEach((option, i) => {
      let optionNode = componentNode.firstChild.childNodes[i+1];
      expect(optionNode.textContent).toEqual(option);
      expect(optionNode.getAttribute('value')).toEqual(option);
    });
  });

  it('renders an "other" option', () => {
    const component = TestUtils.renderIntoDocument(
      <SelectWithOther options={options} />
    );

    const componentNode = ReactDOM.findDOMNode(component);

    expect(componentNode.firstChild.lastChild.textContent).toEqual("Other");
    expect(componentNode.firstChild.lastChild.getAttribute('value')).toEqual("__other__");
  });

  it('renders a text input when you select "other"', () => {
    const component = TestUtils.renderIntoDocument(
      <SelectWithOther options={options} />
    );

    const componentNode = ReactDOM.findDOMNode(component);
    const selectNode = componentNode.firstChild;

    TestUtils.Simulate.change(selectNode, {
      target: {
        value: '__other__'
      }
    });

    const inputNode = componentNode.lastChild;

    expect(componentNode.childNodes.length).toEqual(2);
    expect(inputNode.nodeName.toLowerCase()).toEqual('input');
    expect(inputNode.getAttribute('type')).toEqual('text');
  });

  it('renders a text input with the specified value when not one of the options', () => {
    const value = "Some other program";
    const component = TestUtils.renderIntoDocument(
      <SelectWithOther options={options} value={value} />
    );
    const componentNode = ReactDOM.findDOMNode(component);
    const inputNode = componentNode.lastChild;
    expect(componentNode.childNodes.length).toEqual(2);
    expect(inputNode.nodeName.toLowerCase()).toEqual('input');
    expect(inputNode.getAttribute('type')).toEqual('text');
    expect(inputNode.getAttribute('value')).toEqual(value);
  });

  it('calls an onChange prop when the select changes', () => {
    const value = "Sexual Health";
    const newValue = "Sexual Violence";
    const mockOnChange = jest.genMockFunction();
    const component = TestUtils.renderIntoDocument(
      <SelectWithOther options={options} value={value} onChange={mockOnChange} />
    );
    const componentNode = ReactDOM.findDOMNode(component);
    const selectNode = componentNode.firstChild;
    TestUtils.Simulate.change(selectNode, {
      target: {
        value: newValue
      }
    });
    expect(mockOnChange.mock.calls.length).toEqual(1);
    expect(mockOnChange.mock.calls[0][0]).toEqual(newValue);
  });

  it('calls an onChange prop when the other input changes', () => {
    const value = "Sexual Health";
    const newValue = "Totally new value";
    const mockOnChange = jest.genMockFunction();
    const component = TestUtils.renderIntoDocument(
      <SelectWithOther options={options} value={value} onChange={mockOnChange} />
    );
    const componentNode = ReactDOM.findDOMNode(component);
    const selectNode = componentNode.firstChild;
    TestUtils.Simulate.change(selectNode, {
      target: {
        value: '__other__'
      }
    });
    const inputNode = componentNode.lastChild;
    TestUtils.Simulate.change(inputNode, {
      target: {
        value: newValue
      }
    });
    expect(mockOnChange.mock.calls[mockOnChange.mock.calls.length-1][0]).toEqual(newValue);
  });
});
