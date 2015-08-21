import React from 'react';
import classnames from 'classnames';

import InputCommand from './InputCommand';
import OutputResult from './OutputResult';
import OutputLog from './OutputLog';
import CommandPrompt from './CommandPrompt';
import CompletionCandidates from './CompletionCandidates';

export default class Repl extends React.Component {
  render() {
    console.log('Repl#render', this.props);
    let { className, histories, loading, prompt, candidates } = this.props;
    let { requestComplete, requestEvaluate } = this.props;
    return (
      <div className={ classnames('repl', className) } >
        { (histories || []).map((history) => {
          return (
            history.type === 'input' ? <InputCommand data={ history.data } /> :
            history.type === 'output' ? <OutputResult data={ history.data } /> :
            history.type === 'log' ? <OutputLog level={ history.level } message={ history.message } /> :
            null
          );
        })}
        {
          loading ?
          <div className="spinner">Loading...</div> :
          <CommandPrompt data={ prompt } onComplete={ requestComplete } onEvaluate={ requestEvaluate }/>
        }
        {
          candidates && candidates.length > 0 ?
          <CompletionCandidates options={ candidates } /> :
          null
        }
      </div>
    );
  }
}
