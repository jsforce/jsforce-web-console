import React from 'react';

export default class InputCommand extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <pre className='input-command'>&gt; { data }</pre>
    );
  }
}
