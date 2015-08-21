import React from 'react';
import ObjectInspector from 'react-object-inspector';

export default class OutputResult extends React.Component {
  render() {
    const { data, seq } = this.props;
    return (
      <div className='output-result'>
        <div>{ seq }:</div>
        <ObjectInspector data={ data } />
      </div>
    );
  }
}
