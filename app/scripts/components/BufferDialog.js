import React from 'react';
import classnames from 'classnames';

export default class BufferDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = { copied: false };
  }

  componentDidMount() {
    React.findDOMNode(this.refs.textarea).select();
  }

  onKeyUp(e) {
    if (this.state.copied || e.keyCode === 27) {
      this.props.clearCopyBuffer();
    }
  }

  onKeyDown(e) {
    if ((e.keyCode === 67 || e.keyCode === 88) && (e.metaKey || e.ctrlKey)) {
      this.setState({ copied: true });
    }
  }

  render() {
    const { text, clearCopyBuffer } = this.props;
    return (
      <div className='modal' style={ { display: 'block' } }>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' onClick={ clearCopyBuffer }>
                <span>&times;</span>
              </button>
              <h4 className='modal-title'>Copy String</h4>
            </div>
            <div className='modal-body'>
              <textarea ref='textarea' style={ { width: '100%', height: '200px' } }
                defaultValue={ text }
                onKeyUp={ this.onKeyUp.bind(this) }
                onKeyDown={ this.onKeyDown.bind(this) } />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
