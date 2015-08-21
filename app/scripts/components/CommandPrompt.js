import React from 'react';

export default class CommandPrompt extends React.Component {
  constructor(props) {
    super(props);
    const rows = (props.data || '').split(/\n/).length;
    this.state = { rows };
  }

  componentWillReceiveProps(newProps) {
    const ta = React.findDOMNode(this.refs.textarea);
    ta.value = newProps.data;
    ta.focus();
  }

  onKeyUp(e) {
    const { onEvaluate, onComplete } = this.props;
    if (e.keyCode === 13 && !e.shiftKey) { // RETURN
      onEvaluate(e.target.value);
    } else if (e.keyCode === 9) { // TAB
      onComplete(e.target.value);
    }
    const rows = (e.target.value || '').split(/\n/).length;
    this.setState({ rows });
  }

  onKeyDown(e) {
    if (e.keyCode === 9 || (e.keyCode === 13 && !e.shiftKey)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    console.log('CommandPrompt#render()', this.props, this.state);
    const { data } = this.props;
    const { rows } = this.state;
    return (
      <textarea ref='textarea' className='output-result'
        onKeyDown={ this.onKeyDown.bind(this) }
        onKeyUp={ this.onKeyUp.bind(this) }
        style={ { width: '100%' } }
        rows={ rows }
        defaultValue={ data } />
    );
  }
}
