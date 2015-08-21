import React from 'react';
import classnames from 'classnames';

export default class CompletionCandidates extends React.Component {
  render() {
    const { options } = this.props;
    return (
      <ul className='candidates'>
        {
          options.length > 1 ?
          options.map((option) => {
            return (
              <li className={ classnames('candidate-item', option.type ? `candidate-${option.type.toLowerCase()}` : '') }>
                <span className='candidate-label'>{ option.label }</span>
                {
                  option.type ?
                  <span className='candidate-type'>{ ' (' + option.type + ')' }</span> :
                  null
                }
              </li>
            );
          }) :
          null
        }
      </ul>
    );
  }
}
