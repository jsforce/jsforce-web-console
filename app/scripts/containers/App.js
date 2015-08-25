import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Repl from '../components/Repl';
import { createReplActions } from '../actions/index.js';
import { rootSelector } from '../selector';

import SforceEvaluator from '../service/SforceEvaluator';
import ContextEvaluator from '../service/ContextEvaluator';

import config from '../config';

const { jsforce } = global;

function mapDispatchToProps(dispatch) {
  const ctxEvaluator = new ContextEvaluator({ jsforce });
  const ctx = ctxEvaluator.getContext();
  const evaluator =
    new SforceEvaluator(ctx, config.connection, ctxEvaluator);
  const replActions = createReplActions(evaluator);

  const ac = bindActionCreators(replActions, dispatch);

  ctx.copy = (v) => {
    ac.copyText(v);
  };
  ctx.console = {
    log: (...args) => {
      console.log(...args);
      ac.outputLog(args[0]);
    }
  };
  ctx.clear = () => {
    setTimeout(() => ac.clearLogs(), 10);
  };

  setTimeout(() => ac.init(), 1000);
  return ac;
}

export default connect(rootSelector, mapDispatchToProps)(Repl);
