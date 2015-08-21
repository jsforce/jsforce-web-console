import React from 'react';

export default class CompletionCandidates extends React.Component {
  render() {
    const { options } = this.props;
    return (
      <ul className='output-result'>
        {
          options.length > 1 ?
          options.map((option) => {
            return (
              <li>{ option.label }</li>
            );
          }) :
          null
        }
      </ul>
    );
  }
}
