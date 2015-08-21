import React from 'react';
import classnames from 'classnames';

export default class OutputLog extends React.Component {
  render() {
    const { level, message } = this.props;
    return (
      <div className={ classnames('output-log', `output-${level}`) }>
        { level === 'error' ? 'Error: ' + message : message}
      </div>
    );
  }
}
