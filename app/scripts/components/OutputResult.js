import React from 'react';
import ObjectInspector from 'react-object-inspector';

export default class OutputResult extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div className='output-result'>
        <ObjectInspector data={ data } />
      </div>
    );
  }
}
