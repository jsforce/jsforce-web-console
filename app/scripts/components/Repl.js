import React from 'react';
import classnames from 'classnames';

import InputCommand from './InputCommand';
import OutputResult from './OutputResult';
import OutputLog from './OutputLog';
import CommandPrompt from './CommandPrompt';
import CompletionCandidates from './CompletionCandidates';
import BufferDialog from './BufferDialog';


export default class Repl extends React.Component {
  componentWillReceiveProps() {
    setTimeout(() => {
      window.scrollTo(0, document.body.clientHeight);
    }, 100);
  }

  render() {
    console.log('Repl#render', this.props);
    let { className, histories, loading, prompt, candidates, copyBuffer } = this.props;
    let { requestComplete, requestEvaluate, goBackInHistory, goForwardInHistory, clearCopyBuffer } = this.props;
    return (
      <div className={ classnames('repl', className) } >
        { (histories || []).map((history) => {
          return (
            history.type === 'input' ? <InputCommand { ...history } /> :
            history.type === 'output' ? <OutputResult { ...history } /> :
            history.type === 'log' ? <OutputLog { ...history } /> :
            null
          );
        })}
        {
          loading ?
          <div className="spinner">Loading...</div> :
          <CommandPrompt data={ prompt }
            onComplete={ requestComplete }
            onEvaluate={ requestEvaluate }
            onBackHistory={ goBackInHistory }
            onForwardHistory={ goForwardInHistory }
          />
        }
        {
          candidates && candidates.length > 0 ?
          <CompletionCandidates options={ candidates } /> :
          null
        }
        {
          copyBuffer ?
          <BufferDialog text={ copyBuffer } clearCopyBuffer={ clearCopyBuffer } /> :
          null
        }
      </div>
    );
  }
}
