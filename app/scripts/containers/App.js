import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Repl from '../components/Repl';
import { createReplActions } from '../actions/index.js';

import SforceEvaluator from '../service/SforceEvaluator';
import ContextEvaluator from '../service/ContextEvaluator';

import config from '../config';

const { jsforce } = global;
function mapStateToProps(state) {
  return { ...state };
}

function mapDispatchToProps(dispatch) {
  const ctxEvaluator = new ContextEvaluator({ jsforce });
  const ctx = ctxEvaluator.getContext();
  const evaluator =
    new SforceEvaluator(ctx, config.connection, ctxEvaluator);
  const replActions = createReplActions(evaluator);
  let ac = bindActionCreators(replActions, dispatch);
  ctx.copy = (v) => {
    setTimeout(() => ac.copyText(v), 500);
  };
  setTimeout(() => ac.init(), 1000);
  return ac;
}

export default connect(mapStateToProps, mapDispatchToProps)(Repl);
